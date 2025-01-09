.PHONY: build_e2e
build_e2e:
	docker build -t form-schema-e2e ./e2e

.PHONY: test_e2e
test_e2e:
	docker run \
	--rm \
	-v ./e2e/tests:/app/tests \
	-v ./e2e/results:/app/results \
	-v ./packages/react-form-schema-ui-mui-playwright/dist:/app/@vtaits/react-form-schema-ui-mui-playwright \
	-u $(shell id -u):$(shell id -g) \
	--network="host" \
	form-schema-e2e

.PHONY: dev_e2e
dev_e2e:
	docker run \
	--rm \
	-v ./e2e/tests:/app/tests \
	-v ./e2e/results:/app/results \
	-v ./packages/react-form-schema-ui-mui-playwright/dist:/app/@vtaits/react-form-schema-ui-mui-playwright \
	-u $(shell id -u):$(shell id -g) \
	--network="host" \
	-p 5900:5900 \
	--entrypoint ./dev.sh \
	form-schema-e2e
