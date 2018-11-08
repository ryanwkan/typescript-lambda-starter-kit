#
# These can be overriden by the CI server using enviroment variables.
#
APPNAME ?= public-api-gw-lambda
ENV ?= dev
ENV_NO ?= 1
TAG := $(shell git describe --tags --abbrev=0)

ev ?= events/test.json
fn ?= Function
tp ?= deploy.sam.yaml

# default local development target
default: clean compile build deploy

# used in CI
ci: clean setup compile build

clean:
	rm -f handler.zip
	rm -f *.out.yaml
	rm -rf node_modules

test: compile
	yarn lint
	yarn test

#setup:
#	curl --silent --location https://rpm.nodesource.com/setup_6.x | bash -
#	yum -y install nodejs zip
#	npm install -g typescript tslint

compile:
	npm install
	npm run-script prepare


# build and package with just the required deps, then put it back to dev
#
# Note: This aims to build reproducable zip files, hence the touch to reset timestamps
build: clean
	npm install --production --no-optional
	find index.js lib node_modules -exec touch -t 201701010000 {} +
	zip -X -q -r handler.zip index.js lib node_modules
	npm install

build-sam-local:
	find index.js lib node_modules -exec touch -t 201701010000 {} +
	zip -X -q -r handler.zip index.js lib node_modules

deploy: build

	echo "Running as: $(shell aws sts get-caller-identity --query Arn --output text)"

	aws cloudformation package \
		--template-file deploy.sam.yaml \
		--output-template-file deploy.out.yaml \
		--s3-bucket $(S3_BUCKET) \
		--s3-prefix sam

	aws cloudformation deploy \
		--template-file deploy.out.yaml \
		--capabilities CAPABILITY_IAM \
		--stack-name $(APPNAME)-$(ENV)-$(ENV_NO) \
		--parameter-overrides EnvironmentName=$(ENV) EnvironmentNumber=$(ENV_NO) \
			Tag=$(TAG)

# sam-local
# https://github.com/awslabs/aws-sam-local
# usage: make local ev=event_file.json fn=lambda_function
local:	build-sam-local

	echo "Running -- sam local invoke -e $(ev) $(fn)"

	sam local invoke $(fn) --event $(ev) --template $(tp)


# sam-local debug
# https://github.com/awslabs/aws-sam-local
# usage: make local ev=event_file.json fn=lambda_function
debug:	build-sam-local

	echo "Running -- sam local invoke -e $(ev) -d 3838 $(fn)"

	sam local invoke $(fn) --event $(ev) --template $(tp) -d 3838 $(fn)

.PHONY: test clean build deploy
