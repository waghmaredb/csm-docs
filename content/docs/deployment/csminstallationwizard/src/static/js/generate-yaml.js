/*
 *
 * Copyright © 2023 Dell Inc. or its subsidiaries. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
var template = "";
var version = "";
var observabilityEnabled = false;
var authorizationEnabled = false;
var replicationEnabled = false;

function generateYamlFile(tmpl) {
	var yamlFile = null;
	setMap(version);
	values = setValues(csmMap, CONSTANTS)
	yaml = createYamlString(tmpl, values, driver, CONSTANTS)
	var data = new Blob([yaml], {
		type: 'text/plain'
	});
	if (yamlFile !== null) {
		window.URL.revokeObjectURL(yamlFile);
	}
	yamlFile = window.URL.createObjectURL(data);
	return yamlFile;
}

function setValues(csmMapValues, CONSTANTS_PARAM) {
	var DriverValues = new Object();
	DriverValues.csmVersion = document.getElementById("csm-version").value
	DriverValues.driverVersion = csmMapValues.get("driverVersion");
	DriverValues.imageRepository = document.getElementById("image-repository").value;
	DriverValues.monitor = $("#monitor").prop('checked') ? true : false;
	DriverValues.certSecretCount = document.getElementById("cert-secret-count").value;
	DriverValues.controllerCount = document.getElementById("controller-count").value;
	DriverValues.volNamePrefix = document.getElementById("vol-name-prefix").value;
	DriverValues.snapNamePrefix = document.getElementById("snapshot-prefix").value;
	DriverValues.fsGroupPolicy = document.getElementById("fsGroup-Policy").value;
	DriverValues.controllerPodsNodeSelector = $("#controller-pods-node-selector").prop('checked') ? true : false;
	DriverValues.nodePodsNodeSelector = $("#node-pods-node-selector").prop('checked') ? true : false;
	DriverValues.nodeSelectorLabel = document.getElementById("node-selector-label").value || '""';
	var labels = DriverValues.nodeSelectorLabel.split(":");
	var nodeSelector = CONSTANTS_PARAM.NODE_SELECTOR_TAB + labels[0] + ': "' + labels[1] + '"';
	if ($("#controller-pods-node-selector").prop('checked') === true) {
		DriverValues.controllerPodsNodeSelector = nodeSelector;
	}
	if ($("#node-pods-node-selector").prop('checked') === true) {
		DriverValues.nodePodsNodeSelector = nodeSelector;
	}
	DriverValues.snapshot = $("#snapshot").prop('checked') ? true : false;
	DriverValues.vgsnapshot = $("#vgsnapshot").prop('checked') ? true : false;
	DriverValues.resizer = $("#resizer").prop('checked') ? true : false;
	DriverValues.healthMonitor = $("#health-monitor").prop('checked') ? true : false;
	DriverValues.replication = $("#replication").prop('checked') ? true : false;
	DriverValues.migration = $("#migration").prop('checked') ? true : false;
	DriverValues.observability = $("#observability").prop('checked') ? true : false;
	DriverValues.observabilityMetrics = $("#observability-metrics").prop('checked') ? true : false;
	DriverValues.authorization = $("#authorization").prop('checked') ? true : false;
	DriverValues.resiliency = $("#resiliency").prop('checked') ? true : false;
	DriverValues.storageCapacity = $("#storage-capacity").prop('checked') ? true : false;
	DriverValues.authorizationSkipCertValidation = $("#authorization-skip-cert-validation").prop('checked') ? true : false;
	DriverValues.authorizationProxyHost = document.getElementById("authorization-proxy-host").value || '""';
	DriverValues.vgsnapshotImage = DriverValues.imageRepository + CONSTANTS_PARAM.SLASH + csmMapValues.get("vgsnapshotImage");
	DriverValues.replicationImage = DriverValues.imageRepository + CONSTANTS_PARAM.SLASH + csmMapValues.get("replicationImage");
	DriverValues.migrationImage = DriverValues.imageRepository + CONSTANTS_PARAM.SLASH + csmMapValues.get("migrationImage");
	DriverValues.migrationNodeRescanSidecarImage = DriverValues.imageRepository + CONSTANTS_PARAM.SLASH + csmMapValues.get("migrationNodeRescanSidecarImage");
	DriverValues.authorizationImage = DriverValues.imageRepository + CONSTANTS_PARAM.SLASH + csmMapValues.get("authorizationImage");
	DriverValues.powermaxCSIReverseProxyImage = DriverValues.imageRepository + CONSTANTS_PARAM.SLASH + csmMapValues.get("powermaxCSIReverseProxyImage");
	DriverValues.podmonImage = DriverValues.imageRepository + CONSTANTS_PARAM.SLASH + csmMapValues.get("podmonImage");
	DriverValues.appMobilityVeleroPluginImage = DriverValues.imageRepository + CONSTANTS_PARAM.SLASH + csmMapValues.get("appMobilityVeleroPluginImage");
	
	if (DriverValues.csmVersion === "1.4.0" || DriverValues.csmVersion === "1.5.0") {
		DriverValues.powermaxCSIReverseProxyImageEnabled = $("#powermax-csi-reverse-proxy").prop('checked') ? true : false;
	} else {
		DriverValues.powermaxCSIReverseProxyImageEnabled = true;
	}

	DriverValues.applicationMobility = $("#application-mobility").prop('checked') ? true : false;
	DriverValues.velero = $("#velero").prop('checked') ? true : false;
	DriverValues.certManagerEnabled = $("#cert-manager-enabled").prop('checked') ? true : false;
	observabilityEnabled = DriverValues.observability;
	authorizationEnabled = DriverValues.authorization;
	replicationEnabled = DriverValues.replication;

	DriverValues.storageArrayId = $("#storage-array-id").val();
	DriverValues.storageArrayEndpointUrl = $("#storage-array-endpoint-url").val() || '""';
	DriverValues.storageArrayBackupEndpointUrl = $("#storage-array-backup-endpoint-url").val() || '""';
	DriverValues.clusterPrefix = $("#cluster-prefix").val();
	DriverValues.portGroups = $("#port-groups").val();

	DriverValues.vSphereEnabled = $("#vSphere").prop('checked') ? true : false;
	DriverValues.vSphereFCPortGroup = $("#vSphere-fc-port-group").val();
	DriverValues.vSphereFCHostName = $("#vSphere-fc-host-name").val();
	DriverValues.vSphereVCenterHost = $("#vSphere-vCenter-host").val();
	DriverValues.vSphereVCenterCredSecret = $("#vSphere-vCenter-cred-secret").val();
	return DriverValues
}

function createYamlString(yaml, obj, driverParam, CONSTANTS_PARAM) {
	yaml = yaml.replaceAll("$IMAGE_REPOSITORY", obj.imageRepository);
	yaml = yaml.replaceAll("$VERSION", obj.driverVersion);
	yaml = yaml.replaceAll("$MONITOR_ENABLED", obj.monitor);
	yaml = yaml.replaceAll("$CERT_SECRET_COUNT", obj.certSecretCount);
	yaml = yaml.replaceAll("$CONTROLLER_COUNT", obj.controllerCount);
	yaml = yaml.replaceAll("$CONTROLLER_POD_NODE_SELECTOR", obj.controllerPodsNodeSelector);
	yaml = yaml.replaceAll("$NODE_POD_NODE_SELECTOR", obj.nodePodsNodeSelector);
	yaml = yaml.replaceAll("$HEALTH_MONITOR_ENABLED", obj.healthMonitor);
	yaml = yaml.replaceAll("$VG_SNAPSHOT_ENABLED", obj.vgsnapshot);
	yaml = yaml.replaceAll("$VG_SNAPSHOT_IMAGE", obj.vgsnapshotImage);
	yaml = yaml.replaceAll("$SNAPSHOT_ENABLED", obj.snapshot);
	yaml = yaml.replaceAll("$RESIZER_ENABLED", obj.resizer);
	yaml = yaml.replaceAll("$REPLICATION_ENABLED", obj.replication);
	yaml = yaml.replaceAll("$REPLICATION_IMAGE", obj.replicationImage);
	yaml = yaml.replaceAll("$MIGRATION_ENABLED", obj.migration);
	yaml = yaml.replaceAll("$MIGRATION_IMAGE", obj.migrationImage);
	yaml = yaml.replaceAll("$MIGRATION_NODE_RESCAN_SIDECAR_IMAGE", obj.migrationNodeRescanSidecarImage);
	yaml = yaml.replaceAll("$AUTHORIZATION_ENABLED", obj.authorization);
	yaml = yaml.replaceAll("$AUTHORIZATION_IMAGE", obj.authorizationImage);
	yaml = yaml.replaceAll("$AUTHORIZATION_PROXY_HOST", obj.authorizationProxyHost);
	yaml = yaml.replaceAll("$AUTHORIZATION_SKIP_CERTIFICATE_VALIDATION", obj.authorizationSkipCertValidation);
	yaml = yaml.replaceAll("$OBSERVABILITY_ENABLED", obj.observability);
	yaml = yaml.replaceAll("$RESILIENCY_ENABLED", obj.resiliency);
	yaml = yaml.replaceAll("$PODMAN_IMAGE", obj.podmonImage);
	yaml = yaml.replaceAll("$STORAGE_CAPACITY_ENABLED", obj.storageCapacity);
	yaml = yaml.replaceAll("$POWERMAX_CSI_REVERSE_PROXY_IMAGE_ENABLED", obj.powermaxCSIReverseProxyImageEnabled);

	yaml = yaml.replaceAll("$POWERMAX_STORAGE_ARRAY_ID", obj.storageArrayId);
	yaml = yaml.replaceAll("$POWERMAX_STORAGE_ARRAY_ENDPOINT_URL", obj.storageArrayEndpointUrl);
	yaml = yaml.replaceAll("$POWERMAX_STORAGE_ARRAY_BACKUP_ENDPOINT_URL", obj.storageArrayBackupEndpointUrl);
	yaml = yaml.replaceAll("$POWERMAX_MANAGEMENT_SERVERS_ENDPOINT_URL", obj.storageArrayEndpointUrl);
	yaml = yaml.replaceAll("$POWERMAX_CSI_REVERSE_PROXY_IMAGE", obj.powermaxCSIReverseProxyImage);
	yaml = yaml.replaceAll("$POWERMAX_CLUSTER_PREFIX", obj.clusterPrefix);
	yaml = yaml.replaceAll("$POWERMAX_PORT_GROUPS", obj.portGroups);
	
	yaml = yaml.replaceAll("$VSPHERE_ENABLED", obj.vSphereEnabled);
	yaml = yaml.replaceAll("$VSPHERE_FC_PORT_GROUP", obj.vSphereFCPortGroup);
	yaml = yaml.replaceAll("$VSPHERE_FC_HOST_NAME", obj.vSphereFCHostName);
	yaml = yaml.replaceAll("$VSPHERE_VCENTER_HOST", obj.vSphereVCenterHost);
	yaml = yaml.replaceAll("$VSPHERE_VCENTER_CRED_SECRET", obj.vSphereVCenterCredSecret);

	if (driverParam === CONSTANTS_PARAM.POWERSTORE) {
		yamlTpl = yamlTpl.replaceAll("$POWERSTORE_ENABLED", true);
		releaseName = CONSTANTS_PARAM.POWERSTORE;
	} else if (driverParam === CONSTANTS_PARAM.POWERFLEX) {
		yamlTpl = yamlTpl.replaceAll("$POWERFLEX_ENABLED", true);
		releaseName = CONSTANTS_PARAM.POWERFLEX;
	} else if (driverParam === CONSTANTS_PARAM.POWERMAX) {
		yamlTpl = yamlTpl.replaceAll("$POWERMAX_ENABLED", true);
		releaseName = CONSTANTS_PARAM.POWERMAX;
	} else if (driverParam === CONSTANTS_PARAM.POWERSCALE) {
		yamlTpl = yamlTpl.replaceAll("$POWERSCALE_ENABLED", true);
		releaseName = CONSTANTS_PARAM.POWERSCALE;
	} else {
		yamlTpl = yamlTpl.replaceAll("$UNITY_ENABLED", true);
		releaseName = CONSTANTS_PARAM.UNITY;
	}
	yamlTpl = yamlTpl.replaceAll("$POWERSTORE_ENABLED", false);
	yamlTpl = yamlTpl.replaceAll("$POWERFLEX_ENABLED", false);
	yamlTpl = yamlTpl.replaceAll("$POWERMAX_ENABLED", false);
	yamlTpl = yamlTpl.replaceAll("$POWERSCALE_ENABLED", false);
	yamlTpl = yamlTpl.replaceAll("$UNITY_ENABLED", false);

	if (yamlTplValues.observabilityMetrics) {
		if (driverParam === CONSTANTS_PARAM.POWERSTORE) {
			yamlTpl = yamlTpl.replaceAll("$POWERSTORE_OBSERVABILITY_METRICS_ENABLED", true);
		} else if (driverParam === CONSTANTS_PARAM.POWERMAX) {
			yamlTpl = yamlTpl.replaceAll("$POWERMAX_OBSERVABILITY_METRICS_ENABLED", true);
		} else if (driverParam === CONSTANTS_PARAM.POWERFLEX) {
			yamlTpl = yamlTpl.replaceAll("$POWERFLEX_OBSERVABILITY_METRICS_ENABLED", true);
		} else if (driverParam === CONSTANTS_PARAM.POWERSCALE) {
			yamlTpl = yamlTpl.replaceAll("$POWERSCALE_OBSERVABILITY_METRICS_ENABLED", true);
		}
	}
	yamlTpl = yamlTpl.replaceAll("$POWERSTORE_OBSERVABILITY_METRICS_ENABLED", false);
	yamlTpl = yamlTpl.replaceAll("$POWERMAX_OBSERVABILITY_METRICS_ENABLED", false);
	yamlTpl = yamlTpl.replaceAll("$POWERFLEX_OBSERVABILITY_METRICS_ENABLED", false);
	yamlTpl = yamlTpl.replaceAll("$POWERSCALE_OBSERVABILITY_METRICS_ENABLED", false);
	yamlTpl = yamlTpl.replaceAll("$CERT_MANAGER_ENABLED", yamlTplValues.certManagerEnabled);

	const regex = /\$[a-zA-Z0-9_-]*/g;
	yamlTpl = yamlTpl.replaceAll(regex, '""');

	return yamlTpl
}

function loadTemplate(array, templateType, csmVersion) {
	var tmplFile;
	switch (templateType) {
		case CONSTANTS.HELM:
			tmplFile = CONSTANTS.TEMP_DIR + CONSTANTS.SLASH + CONSTANTS.HELM + CONSTANTS.SLASH + CONSTANTS.CSM + CONSTANTS.HYPHEN + csmVersion + CONSTANTS.HYPHEN + CONSTANTS.VALUES + CONSTANTS.TEMP_EXT;
			break;
		case CONSTANTS.OPERATOR:
			tmplFile = CONSTANTS.TEMP_DIR + CONSTANTS.SLASH + CONSTANTS.OPERATOR + CONSTANTS.SLASH + CONSTANTS.CSM + CONSTANTS.HYPHEN + array + CONSTANTS.HYPHEN + csmVersion + CONSTANTS.TEMP_EXT;
			break;
	}

	$.get(tmplFile, function(data) {
		template = String(data)
	}, "text");
}

if (typeof exports !== 'undefined') {
	module.exports = {
		setValues,
		createYamlString
	};
}
