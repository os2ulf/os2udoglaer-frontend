export const useSharedSearchKeyword = () => {
  const sharedSearchKeyword = useState<string>('sharedSearchKeyword', () => '');
  return { sharedSearchKeyword };
};
