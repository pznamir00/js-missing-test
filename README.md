# Javascript Missing Test

## About

*JS Missing Test* is GitHub Action that analyses the code and detects which files don't have their test files. If source file without it's own test is detected, the action will automatically add a comment with that information.

The action reads whole project's tree in a repository and gets all the source files defined in source directory (defined by user). The script currently supports following file formats: .js, .jsx, .ts, .tsx. If a source file is detected, the action searches corresponding file with test extension (defined by user). E.g. for 'src/dir/script.js', corresponding test file can be 'src/dir/script.test.js'. If expected file is missing, it will be reported as comment for the pull request.

## Doc

### Parameters

| Parameter   | Description        | Default Value | Required |
|-------------|--------------------|---------------|----------|
|owner        |repo owner name     |               |Yes       |
|repo         |repo name           |               |Yes       |
|pr_number    |pull request number |               |Yes       |
|token        |github token        |               |Yes       |
|test_file_ext|test file extension used in the project (e.g. test.js, spec.ts) |               |Yes       |
|lookup_strategy|strategy of searching test files. It accepts 2 possible values: same-dir (test file looked for in same directory where source file), sep-dir:\<path-to-dir\> (define all the test files in specific directory that is provided after ':' character)                 |same-dir       |No
|root_directory|root directory of source files. Other folders won't be searched     |src               |No       |
|ignore_pattern|regex for files that needs to be ignored|               |No       |


### Lookup Strategy

The action supports 2 lookup strategies that define way of searching test files:
- same directory *(same-dir)* - test file will be searched in the same directory where the source file is located,
- separate directory *(sep-dir:<dir-path>)* - test file will be searched in directory provided by user in *<dir-path>* argument

## How to use

You can define your action on events related to pull requests. You can use the following code:

```yaml
on:
  pull_request:
    types: [opened, reopened, synchronize]

permissions:
  contents: read

jobs:
  detect-missing-test-files:
    runs-on: ubuntu-latest
    steps:
      - name: 'Detect missing test files'
        uses: pznamir00/js-missing-test@v1.0.0
        with:
          owner: ${{ github.repository_owner }}
          repo: ${{ github.event.repository.name }}
          pr_number: ${{ github.event.number }}
          token: ${{ secrets.GITHUB_TOKEN }}
          test_file_ext: test.js

```
