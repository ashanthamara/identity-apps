/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/**
 * Identity provider settings key in local storage.
 * @defaultValue
 */
export const IDENTITY_PROVIDER_SETTINGS_STORAGE_KEY = "identity_provider_settings";

/**
 * Path to the identity provider page.
 * @defaultValue
 */
export const IDENTITY_PROVIDER_PAGE_PATH = "/identity-providers";

/**
 * Class containing app constants.
 */
export class IdentityProviderConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     */
    /* eslint-disable @typescript-eslint/no-empty-function */
    private constructor() { }

    /**
     * Paths for the identity provider management config files.
     */
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    public static readonly IDENTITY_PROVIDER_MGT_CONFIG_PATHS: any = {
        META: "configs/identity-provider-mgt.meta.json"
    };

    /**
     * Internal domain name.
     *
     */
    public static readonly INTERNAL_DOMAIN = "Internal/";

    /**
     * Application domain name.
     *
     */
    public static readonly APPLICATION_DOMAIN = "Application/";

}

export const GOOGLE_IDP_NAME = "Google";

export const GOOGLE_IDP_ID = "8ea23303-49c0-4253-b81f-82c0fe6fb4a0";
export const OIDC_IDP_ID = "oidc-idp";
export const ENTERPRISE_IDP_ID = "enterprise-idp";
