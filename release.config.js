export default {
  branches: ['main'],
  repositoryUrl: 'https://github.com/bhouston/tanstack-router-ga4.git',
  tagFormat: 'v${version}',
  plugins: [
    ['@semantic-release/commit-analyzer', { preset: 'conventionalcommits' }],
    ['@semantic-release/release-notes-generator', { preset: 'conventionalcommits' }],
    ['@semantic-release/changelog', { changelogFile: 'packages/tanstack-router-ga4/publish/CHANGELOG.md' }],
    ['@semantic-release/npm', { pkgRoot: 'packages/tanstack-router-ga4/publish' }],
    [
      '@semantic-release/github',
      {
        successCommentCondition: false,
        failCommentCondition: false,
        releasedLabels: false,
        assets: [{ path: 'packages/tanstack-router-ga4/publish/CHANGELOG.md', label: 'Changelog' }],
      },
    ],
  ],
};
