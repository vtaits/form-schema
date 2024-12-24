.PHONY: build
build:
	docker build -t form-schema-e2e .

.PHONY: test
test:
	docker run --rm -v ./tests:/app/tests -v ./../packages/react-form-schema-ui-mui-playwright/dist:/app/@vtaits/react-form-schema-ui-mui-playwright --network="host" form-schema-e2e

.PHONY: dev
dev:
	docker run --rm -v ./tests:/app/tests -v ./../packages/react-form-schema-ui-mui-playwright/dist:/app/@vtaits/react-form-schema-ui-mui-playwright --network="host" -p 5900:5900  --entrypoint ./dev.sh form-schema-e2e
