/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import React, { FunctionComponent, PropsWithChildren, ReactElement, useEffect, useReducer } from "react";
import { AccessProvider } from "react-access-control";
import { AccessControlContext } from "./access-control-context-provider";
import { FeatureGateContext } from "./context/feature-gate";
import { PermissionsInterface } from "./models";
import { FeatureGateAction, FeatureGateActionTypes, FeatureGateInterface } from "./models/feature-gate";

/**
 * Interface to store Access Control Provider props
 */
export interface AccessControlProviderInterface {
    allowedScopes: string;
    features: FeatureGateInterface;
    permissions: PermissionsInterface
}

export const featureGateReducer = (
    state: FeatureGateInterface,
    action: FeatureGateAction
): FeatureGateInterface => {
    switch (action.type) {
        case FeatureGateActionTypes.SET_FEATURE_STATE:
            return { ...state, ...action.payload };
        default:
            return state;
    }
};

/**
 * This will wrap all children passed to it with access control provider
 * with context generated using the scopes received.
 *
 * @param props - Props injected to the component.
 * @returns Access Control Provider component.
 */
export const AccessControlProvider: FunctionComponent<PropsWithChildren<AccessControlProviderInterface>> = (
    props: PropsWithChildren<AccessControlProviderInterface>
): ReactElement => {

    const {
        allowedScopes,
        children,
        features,
        permissions
    } = props;

    const [ , dispatch ] = useReducer(featureGateReducer, features);

    useEffect (() => {
        dispatch({ payload: features, type: FeatureGateActionTypes.SET_FEATURE_STATE });
    }, [ features ]);

    return (
        <AccessProvider>
            <FeatureGateContext.Provider value={ { dispatch, features } }>
                <AccessControlContext
                    allowedScopes={ allowedScopes }
                    permissions={ permissions }
                >
                    { children }
                </AccessControlContext>
            </FeatureGateContext.Provider>
        </AccessProvider>
    );
};
