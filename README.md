# lambda-typescript-skeleton

This skeleton contains a basic [Amazon Web Services](https://aws.amazon.com/) (AWS) lambda function written in [Typescript](https://www.typescriptlang.org) with tests, linting and deployment configuration using AWS [Serverless Application Model](https://github.com/awslabs/serverless-application-model) (SAM).

# Conventions

This project uses a couple of conventions which simplify running parralel environments and configuration.

## Environment

The project has a couple of parameters which are used as a label for resources created, it is composed of:

* EnvironmentName: The name or identifier used for the environment. eg dev, stage or prod
* EnvironmentNumber: This is typically a sequence number given to different sub environments.

## Configuration

[Systems Manager Parameter Store](http://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-paramstore.html) as secret and configuration storage system. To retrieve configuration items we have provisioned prior to launch of a stack we use the `EnvironmentName` and `EnvironmentNumber` to compose a key and retrieve a given setting. An example of his is seen below where the `EnvironmentName` is dev, and the `EnvironmentNumber` is one.

```
/dev/1/RDS/connection-string
```

This enables storage of any number of configuration parameters.

# Prerequisites

Install NodeJS.

```
brew install node
```

Install Typescript.

```
npm install typescript -g
```

Install Typescript Lint.

```
npm install tslint
```

Install the aws CLI.

```
brew install awscli
```

**Note:** This setup assumes mac, it is just here to illustrate the requirements and give you the gist of what is needed.

# Setup

This project is designed as a template for your project, just clone it then start developing in your favourite editor.

Then remove the git directory, and setup your new git project.

```
cd your-project-name
rm -rf .git
git init
git add . 
git commit -a "Initial import of skeleton project"
```

# Usage

## Working on this repository (CI/CD)

This project ustilises Semantic Release (https://github.com/semantic-release/semantic-release/blob/caribou/README.md)

Commit style must follow Angular Commit Guidelines 
https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines

Specifically:

`git commit -m "<type>(scope): <message>"`

Type
    Must be one of the following:

* feat: A new feature
* fix: A bug fix
* docs: Documentation only changes
* style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
* refactor: A code change that neither fixes a bug nor adds a feature
* perf: A code change that improves performance
* test: Adding missing or correcting existing tests
* chore: Changes to the build process or auxiliary tools and libraries such as documentation generation

Here is an example of the release type that will be done based on a commit messages:

| Commit message                                                                                                                                                                                   | Release type               |
|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------|
| `fix(pencil): stop graphite breaking when too much pressure applied`                                                                                                                             | Patch Release              |
| `feat(pencil): add 'graphiteWidth' option`                                                                                                                                                       | ~~Minor~~ Feature Release  |
| `perf(pencil): remove graphiteWidth option`<br><br>`BREAKING CHANGE: The graphiteWidth option has been removed.`<br>`The default graphite width of 10mm is always used for performance reasons.` | ~~Major~~ Breaking Release |
 
Run the tests.

```
make test
```

Deploy the skeleton, this will use the `BUCKET` to stage the handler.zip file, prior to deployment with [SAM](https://github.com/awslabs/serverless-application-model).

```
AWS_PROFILE=myawsprofile AWS_REGION=us-west-2 BUCKET=somebucket.example.com make deploy
```

**Note:** The `Makefile` has been built to enable reproducable builds, this should mean deployments only happen when the code or dependencies are updated.

# License

This project is released under The Unlicense, your free to copy this and do what you like.