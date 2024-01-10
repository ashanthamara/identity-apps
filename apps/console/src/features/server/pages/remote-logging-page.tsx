/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { AlertInterface, AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { PageLayout, ResourceTab } from "@wso2is/react-components";
import React, { FC, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { TabProps } from "semantic-ui-react";
import { AppConstants, history } from "../../core";
import {
    useRemoteLogPublishingConfigs
} from "../api/server";
import { RemoteLoggingConfigForm } from "../components/remote-logging-config-form";
import { LogType, RemoteLogPublishingConfigurationInterface } from "../models/server";
import { RemoteLoggingTabIds } from "../models/ui";

type RemoteLoggingPageInterface = IdentifiableComponentInterface;

export const RemoteLoggingPage: FC<RemoteLoggingPageInterface> = (
    props: RemoteLoggingPageInterface
): ReactElement => {

    const { [ "data-componentid" ]: componentId } = props;

    const {
        data: remoteLogPublishingConfigs,
        isLoading: isRemoteLogPublishingConfigsLoading,
        error: remoteLogPublishingConfigRetrievalError,
        mutate: mutateRemoteLoggingRequest
    } = useRemoteLogPublishingConfigs();

    const [ activeTab, setActiveTab ] = useState<RemoteLoggingTabIds>(RemoteLoggingTabIds.AUDIT);

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    useEffect(() => {
        if (remoteLogPublishingConfigRetrievalError && !isRemoteLogPublishingConfigsLoading) {
            dispatch(
                addAlert<AlertInterface>({
                    description: t("console:manage.features.serverConfigs.remoteLogPublishing." +
                    "notification.error.fetchError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:manage.features.serverConfigs.remoteLogPublishing." +
                    "notification.error.fetchError.message")
                })
            );
        }
    }, [ ]);

    /**
     * Handles the back button click event.
     */
    const handleBackButtonClick = (): void => {
        history.push(AppConstants.getPaths().get("SERVER"));
    };

    const panes: any = [
        {
            "data-tabid": RemoteLoggingTabIds.AUDIT,
            menuItem: "Audit Logs"
        },
        {
            "data-tabid": RemoteLoggingTabIds.CARBON,
            menuItem: "Carbon Logs"
        }
    ];

    return (
        <PageLayout
            title={ t("console:manage.features.serverConfigs.remoteLogPublishing.title") }
            pageTitle={ t("console:manage.features.serverConfigs.remoteLogPublishing.pageTitle") }
            description={ <>{ t("console:manage.features.serverConfigs.remoteLogPublishing.description") }</> }
            data-componentid={ `${ componentId }-page-layout` }
            backButton={ {
                "data-testid": `${ componentId }-page-back-button`,
                onClick: handleBackButtonClick,
                text: t("console:manage.pages.rolesEdit.backButton", { type: "Server" })
            } }
            bottomMargin={ false }
            isLoading={ isRemoteLogPublishingConfigsLoading }
        >
            <ResourceTab
                onTabChange={ (_event: React.SyntheticEvent, _data: TabProps, activeTabMetadata?: {
                    "data-tabid": RemoteLoggingTabIds;
                    index: number | string;
                }) => {
                    activeTabMetadata && setActiveTab(activeTabMetadata["data-tabid"]);
                } }
                className="tabs resource-tabs"
                menu={ { pointing: true, secondary: true } }
                panes={ panes }
                renderActiveOnly
            />
            { activeTab === RemoteLoggingTabIds.AUDIT && (
                <RemoteLoggingConfigForm
                    mutateRemoteLoggingRequest={ mutateRemoteLoggingRequest }
                    logType={ LogType.AUDIT }
                    logConfig={ remoteLogPublishingConfigs?.find(
                        (config: RemoteLogPublishingConfigurationInterface) => config.logType === LogType.AUDIT
                    ) }
                />
            ) }
            { activeTab === RemoteLoggingTabIds.CARBON && (
                <RemoteLoggingConfigForm
                    mutateRemoteLoggingRequest={ mutateRemoteLoggingRequest }
                    logType={ LogType.CARBON }
                    logConfig={ remoteLogPublishingConfigs?.find(
                        (config: RemoteLogPublishingConfigurationInterface) => config.logType === LogType.CARBON
                    ) }
                />
            ) }
        </PageLayout>
    );
};

/**
 * Default props for the component.
 */
RemoteLoggingPage.defaultProps = {
    "data-componentid": "remote-logging-page"
};

export default RemoteLoggingPage;
