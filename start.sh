#!/bin/bash
if [["$ENV_SCRIPT" == "dev"]]
then
	npm run start:dev
else
	npm run start:prod
fi
