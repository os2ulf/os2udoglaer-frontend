<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:s="https://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" indent="yes"/>
  
  <xsl:template match="/">
    <html>
      <head>
        <title>Sitemap</title>
        <style>
          body {
            font-family: Arial, sans-serif;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          th, td {
            padding: 10px;
            border: 1px solid #ddd;
            text-align: left;
          }
          th {
            background-color: #f4f4f4;
          }
        </style>
      </head>
      <body>
        <h1>Sitemap</h1>
        <table>
          <tr>
            <th>URL</th>
            <th>Last Modified</th>
          </tr>
          <xsl:for-each select="//s:url">
            <tr>
              <td>
                <a href="{s:loc}">
                  <xsl:value-of select="s:loc"/>
                </a>
              </td>
              <td>
                <xsl:value-of select="s:lastmod"/>
              </td>
            </tr>
          </xsl:for-each>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
