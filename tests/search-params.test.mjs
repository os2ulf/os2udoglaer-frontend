import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildSearchParams, readSearchParams } from '../utils/searchParams.ts';
import { getSearchRequest } from '../server/utils/searchRequest.ts';
import { getContentRequest } from '../server/utils/contentRequest.ts';
import {
  normalizeMapMarkerId,
  matchingMapMarkerId,
} from '../utils/mapMarker.ts';

test('search URLs survive reload with Danish text, reserved characters, filters, dates and page', () => {
  const state = {
    mapMarker: '14746',
    mapViewport: { lat: 56.156739, lng: 10.21076, zoom: 13 },
    mode: 'map',
    search: 'kunst & kultur + ø',
    page: 3,
    sort: 'title_asc',
    filters: [
      { searchQueryUrlAlias: 'cifps', value: '1' },
      { searchQueryUrlAlias: 'type', value: 'a:b' },
    ],
    startDate: '27.10.2026',
    endDate: '30.10.2026',
  };
  const url = new URL(
    `https://frontend.example/grundskole-0?${buildSearchParams(state)}`,
  );
  assert.deepEqual(readSearchParams(url.searchParams), state);
});

test('list mode removes only the map selection and invalid modes fall back to the list', () => {
  const map = buildSearchParams({
    mode: 'map',
    search: 'teater',
    mapViewport: { lat: 56.15, lng: 10.21, zoom: 12 },
    mapMarker: '926',
    sort: 'title',
    page: 2,
    filters: [{ searchQueryUrlAlias: 'cifps', value: '1' }],
    startDate: '01.11.2026',
    endDate: '30.11.2026',
  });
  const list = buildSearchParams({ ...readSearchParams(map), mode: 'list' });
  assert.equal(map.get('mode'), 'map');
  map.delete('mode');
  assert.deepEqual([...list], [...map]);
  for (const mode of ['', 'list', 'satellite'])
    assert.equal(readSearchParams(new URLSearchParams({ mode })).mode, 'list');
});

test('marker selection supports stable IDs and rejects malformed URL values', () => {
  assert.equal(normalizeMapMarkerId(926), '926');
  assert.equal(normalizeMapMarkerId(0), '0');
  assert.equal(normalizeMapMarkerId('provider-123_ab'), 'provider-123_ab');
  for (const id of [
    '',
    'a'.repeat(129),
    '<script>',
    'with space',
    -1,
    NaN,
    Infinity,
    ['926'],
  ])
    assert.equal(normalizeMapMarkerId(id), undefined);
});

test('a popup can only be restored for a marker still present in the filtered map', () => {
  const markers = [{ id: 926 }, { id: '899' }];
  assert.equal(matchingMapMarkerId('926', markers), '926');
  assert.equal(matchingMapMarkerId('899', markers), '899');
  assert.equal(matchingMapMarkerId('926', [{ id: '899' }]), undefined);
  assert.equal(matchingMapMarkerId('926', []), undefined);
  assert.equal(matchingMapMarkerId(undefined, markers), undefined);
  const state = readSearchParams(
    buildSearchParams({ mode: 'map', mapMarker: '926', sort: 'alphabetical' }),
  );
  const closed = buildSearchParams({ ...state, mapMarker: undefined });
  assert.equal(closed.has('map_marker'), false);
  assert.equal(closed.get('mode'), 'map');
  assert.equal(closed.get('sort_by'), 'alphabetical');
});

test('saved map positions support zero coordinates and reject incomplete or invalid views', () => {
  const zero = { lat: 0, lng: 0, zoom: 0 };
  assert.deepEqual(
    readSearchParams(buildSearchParams({ mapViewport: zero })).mapViewport,
    zero,
  );
  for (const query of [
    'map_lat=56&map_lng=10',
    'map_lat=&map_lng=10&map_zoom=12',
    'map_lat=NaN&map_lng=10&map_zoom=12',
    'map_lat=91&map_lng=10&map_zoom=12',
    'map_lat=56&map_lng=-181&map_zoom=12',
    'map_lat=56&map_lng=10&map_zoom=Infinity',
    'map_lat=56&map_lng=10&map_zoom=20',
    'map_lat=56&map_lng=10&map_zoom=-1',
    'map_lat=56&map_lng=10&map_zoom=12.5',
  ])
    assert.equal(
      readSearchParams(new URLSearchParams(query)).mapViewport,
      undefined,
    );
});

test('map coordinates keep useful precision without making search links excessively long', () => {
  const params = buildSearchParams({
    mapViewport: { lat: 56.156738923, lng: 10.210759893, zoom: 14 },
  });
  assert.deepEqual(readSearchParams(params).mapViewport, {
    lat: 56.156739,
    lng: 10.21076,
    zoom: 14,
  });
  assert.equal(
    buildSearchParams({ mapViewport: { lat: 100, lng: 0, zoom: 12 } }).size,
    0,
  );
});

test('cleared and date filters do not leave a free-only filter or broken filter indexes', () => {
  const params = buildSearchParams({
    filters: [
      { searchQueryUrlAlias: 'cifps', value: 'all' },
      { searchQueryUrlAlias: 'period', value: 'old-date-chip' },
      { searchQueryUrlAlias: 'cctps', value: 76 },
      { searchQueryUrlAlias: 'ctgps', value: '29' },
    ],
    page: 0,
  });
  assert.deepEqual(
    [...params],
    [
      ['f[0]', 'cctps:76'],
      ['f[1]', 'ctgps:29'],
    ],
  );
});

test('invalid page values restore the first page', () => {
  for (const page of ['-1', 'NaN', '1.2', 'Infinity']) {
    assert.equal(readSearchParams(new URLSearchParams({ page })).page, 0);
  }
});

test('content navigation keeps the requested page separate from JSON query options', () => {
  assert.deepEqual(
    getContentRequest({ path: '/grundskole/introduktion-til-moderne-dans' }),
    {
      path: '/grundskole/introduktion-til-moderne-dans',
      query: { format: 'json', region: 'content' },
    },
  );
  assert.deepEqual(getContentRequest({ region: 'settings' }), {
    path: '/',
    query: { format: 'json', region: 'settings' },
  });
});

test('content proxy rejects external targets, traversal and unsupported regions', () => {
  for (const query of [
    { path: '//other.example/' },
    { path: 'https://other.example/' },
    { path: '/a/../node' },
    { path: '/%2e%2e/node' },
    { path: '/%2fother.example' },
    { path: '/page?region=private' },
    { path: '/page', region: 'private' },
  ])
    assert.throws(
      () => getContentRequest(query),
      (error) => error.statusCode === 400,
    );
});

test('the search proxy preserves the upstream query contract without accepting an upstream URL', () => {
  const query = Object.fromEntries(
    buildSearchParams({
      search: 'kunst & kultur',
      page: 2,
      filters: [{ searchQueryUrlAlias: 'cifps', value: '1' }],
    }),
  );
  assert.deepEqual(
    getSearchRequest({
      ...query,
      view: 'content_search',
      display: 'block_6',
      mode: 'map',
      map_lat: '56.15',
      map_lng: '10.21',
      map_zoom: '12',
      map_marker: '926',
      url: 'https://other.example/',
    }),
    {
      path: '/transform/view-results/content_search/block_6',
      query,
    },
  );
});

test('global search always requests the JSON content response', () => {
  assert.deepEqual(getSearchRequest({ search_string: 'museum', page: '1' }), {
    path: '/search',
    query: {
      search_string: 'museum',
      page: '1',
      format: 'json',
      region: 'content',
    },
  });
});

test('the search proxy rejects path traversal, incomplete views and ambiguous query values', () => {
  for (const query of [
    { view: '../node', display: 'block_1' },
    { view: 'https://other.example', display: 'block_1' },
    { view: 'content_search' },
    { display: 'block_6' },
    { search_string: ['one', 'two'] },
  ])
    assert.throws(
      () => getSearchRequest(query),
      (error) => error.statusCode === 400,
    );
});
