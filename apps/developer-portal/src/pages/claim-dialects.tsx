/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import { hasRequiredScopes } from "@wso2is/core/helpers";
import { addAlert } from "@wso2is/core/store";
import { EmptyPlaceholder, LinkButton, PrimaryButton } from "@wso2is/react-components";
import React, { ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Divider, DropdownProps, Grid, Icon, Image, List, PaginationProps, Popup, Segment } from "semantic-ui-react";
import { getDialects } from "../api";
import { AddDialect, AvatarBackground } from "../components";
import { ClaimsList, ListType } from "../components";
import { AdvancedSearchWithBasicFilters } from "../components";
import { EmptyPlaceholderIllustrations } from "../configs";
import { LOCAL_CLAIMS_PATH, UserConstants } from "../constants";
import { history } from "../helpers";
import { ListLayout } from "../layouts";
import { PageLayout } from "../layouts";
import { AlertLevels, ClaimDialect, FeatureConfigInterface } from "../models";
import { AppState } from "../store";
import { filterList, sortList } from "../utils";

/**
 * This displays a list fo claim dialects.
 *
 * @return {ReactElement}
 */
export const ClaimDialectsPage = (): ReactElement => {

    /**
     * Sets the attributes by which the list can be sorted.
     */
    const SORT_BY = [
        {
            key: 0,
            text: "Dialect URI",
            value: "dialectURI"
        }
    ];

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.features);

    const [ dialects, setDialects ] = useState<ClaimDialect[]>(null);
    const [ offset, setOffset ] = useState(0);
    const [ listItemLimit, setListItemLimit ] = useState<number>(0);
    const [ addEditClaim, setAddEditClaim ] = useState(false);
    const [ filteredDialects, setFilteredDialects ] = useState<ClaimDialect[]>(null);
    const [ sortBy, setSortBy ] = useState(SORT_BY[ 0 ]);
    const [ sortOrder, setSortOrder ] = useState(true);
    const [ localURI, setLocalURI ] = useState("");
    const [ searchQuery, setSearchQuery ] = useState("");
    const [ isLoading, setIsLoading ] = useState(true);
    const [ triggerClearQuery, setTriggerClearQuery ] = useState(false);

    const dispatch = useDispatch();

    const { t } = useTranslation();

    /**
     * Fetches all the dialects.
     *
     * @param {number} limit.
     * @param {number} offset.
     * @param {string} sort.
     * @param {string} filter.
     */
    const getDialect = (limit?: number, offset?: number, sort?: string, filter?: string): void => {
        setIsLoading(true);
        getDialects({
            filter,
            limit,
            offset,
            sort
        }).then((response: ClaimDialect[]) => {
            const filteredDialect: ClaimDialect[] = response.filter((claim: ClaimDialect) => {
                if (claim.id === "local") {
                    setLocalURI(claim.dialectURI);
                }
                return claim.id !== "local";
            });

            setDialects(filteredDialect);
            setFilteredDialects(filteredDialect);
        }).catch(error => {
            dispatch(addAlert(
                {
                    description: error?.description || "There was an error while getting the dialects",
                    level: AlertLevels.ERROR,
                    message: error?.message || "Something went wrong"
                }
            ));
        }).finally(() => {
            setIsLoading(false);
        })
    };

    useEffect(() => {
        setListItemLimit(UserConstants.DEFAULT_USER_LIST_ITEM_LIMIT);
        getDialect();
    }, []);

    useEffect(() => {
        setFilteredDialects(sortList(filteredDialects, sortBy.value, sortOrder));
    }, [ sortBy, sortOrder ]);

    /**
     * This slices a portion of the list to display.
     *
     * @param {ClaimDialect[]} list.
     * @param {number} limit.
     * @param {number} offset.
     *
     * @return {ClaimDialect[]} Paginated List.
     */
    const paginate = (list: ClaimDialect[], limit: number, offset: number): ClaimDialect[] => {
        return list?.slice(offset, offset + limit);
    };

    /**
     * Handles change in the number of items to show.
     *
     * @param {React.MouseEvent<HTMLAnchorElement>} event.
     * @param {data} data.
     */
    const handleItemsPerPageDropdownChange = (
        event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps
    ): void => {
        setListItemLimit(data.value as number);
    };

    /**
     * Paginates.
     *
     * @param {React.MouseEvent<HTMLAnchorElement>} event.
     * @param {PaginationProps} data.
     */
    const handlePaginationChange = (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => {
        setOffset((data.activePage as number - 1) * listItemLimit);
    };

    /**
     * Handle sort strategy change.
     *
     * @param {React.SyntheticEvent<HTMLElement>} event.
     * @param {DropdownProps} data.
     */
    const handleSortStrategyChange = (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
        setSortBy(SORT_BY.filter(option => option.value === data.value)[ 0 ]);
    };

    /**
     * Handles sort order change.
     *
     * @param {boolean} isAscending.
     */
    const handleSortOrderChange = (isAscending: boolean) => {
        setSortOrder(isAscending);
    };

    /**
     * Handles the `onFilter` callback action from the
     * dialect search component.
     *
     * @param {string} query - Search query.
     */
    const handleDialectFilter = (query: string): void => {
        try {
            const filteredDialects = filterList(dialects, query, sortBy.value, sortOrder);
            setFilteredDialects(filteredDialects);
            setSearchQuery(query);
        } catch (error) {
            dispatch(addAlert({
                description: error.message,
                level: AlertLevels.ERROR,
                message: "Filter query format incorrect"
            }));
        }
    };

    /**
     * Handles the `onSearchQueryClear` callback action.
     */
    const handleSearchQueryClear = (): void => {
        setTriggerClearQuery(!triggerClearQuery);
        setSearchQuery("");
        setFilteredDialects(dialects);
    };

    /**
     * Resolve the relevant placeholder.
     *
     * @return {React.ReactElement}
     */
    const showPlaceholders = (): ReactElement => {

        if (isLoading) {
            return null;
        }

        // When the search returns empty.
        if (searchQuery) {
            return (
                <EmptyPlaceholder
                    action={ (
                        <LinkButton onClick={ handleSearchQueryClear }>Clear search query</LinkButton>
                    ) }
                    image={ EmptyPlaceholderIllustrations.emptySearch }
                    imageSize="tiny"
                    title={ "No results found" }
                    subtitle={ [
                        `We couldn't find any results for ${ searchQuery }`,
                        "Please try a different search term."
                    ] }
                />
            );
        }

        if (filteredDialects.length === 0) {
            return (
                <EmptyPlaceholder
                    action={ (
                        <PrimaryButton
                            onClick={ () => {
                                setAddEditClaim(true);
                            } }
                        >
                            <Icon name="add"/>
                            New External Dialect
                        </PrimaryButton>
                    ) }
                    image={ EmptyPlaceholderIllustrations.newList }
                    imageSize="tiny"
                    title={ "Add an attribute dialect" }
                    subtitle={ [
                        "There are currently no attribute dialects available.",
                        "You can add a new external dialect easily by following the",
                        "steps in the creation wizard."
                    ] }
                />
            );
        }

        return null;
    };

    return (
        <>
            <AddDialect
                open={ addEditClaim }
                onClose={ () => {
                    setAddEditClaim(false);
                } }
                update={ getDialect }
            />
            <PageLayout
                title="Attribute Dialects"
                description="Create and manage attribute dialects"
                showBottomDivider={ true }
            >
                {
                    hasRequiredScopes(
                        featureConfig?.attributeDialects,
                        featureConfig?.attributeDialects?.scopes?.read) && (
                        <Segment>
                            <List>
                                <List.Item>
                                    <Grid>
                                        <Grid.Row columns={ 2 }>
                                            <Grid.Column width={ 12 }>
                                                <Image
                                                    floated="left"
                                                    verticalAlign="middle"
                                                    rounded
                                                    centered
                                                    size="mini"
                                                >
                                                    <AvatarBackground primary />
                                                    <span className="claims-letter">
                                                        L
                                                    </span>
                                                </Image>
                                                <List.Header>
                                                    Local Dialect
                                                </List.Header>
                                                <List.Description>
                                                    { localURI }
                                                </List.Description>
                                            </Grid.Column>
                                            <Grid.Column width={ 4 } verticalAlign="middle" textAlign="right">
                                                <Popup
                                                    inverted
                                                    trigger={
                                                        <span
                                                            className="local-dialect-direct"
                                                            onClick={ () => {
                                                                history.push(LOCAL_CLAIMS_PATH);
                                                            } }
                                                        >
                                                            <Icon
                                                                name="arrow right"
                                                            />
                                                        </span>
                                                    }
                                                    position="top center"
                                                    content="View local claims"
                                                />
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </List.Item>
                            </List>
                        </Segment>
                    )
                }
                <Divider hidden />
                <ListLayout
                    advancedSearch={
                        <AdvancedSearchWithBasicFilters
                            onFilter={ handleDialectFilter }
                            filterAttributeOptions={ [
                                {
                                    key: 0,
                                    text: "Dialect URI",
                                    value: "dialectURI"
                                }
                            ] }
                            filterAttributePlaceholder={
                                t("devPortal:components.claims.dialects.advancedSearch.form.inputs.filterAttribute" +
                                    ".placeholder")
                            }
                            filterConditionsPlaceholder={
                                t("devPortal:components.claims.dialects.advancedSearch.form.inputs.filterCondition" +
                                    ".placeholder")
                            }
                            filterValuePlaceholder={
                                t("devPortal:components.claims.dialects.advancedSearch.form.inputs.filterValue" +
                                    ".placeholder")
                            }
                            placeholder={ t("devPortal:components.claims.dialects.advancedSearch.placeholder") }
                            defaultSearchAttribute="dialectURI"
                            defaultSearchOperator="co"
                            triggerClearQuery={ triggerClearQuery }
                        />
                    }
                    currentListSize={ listItemLimit }
                    listItemLimit={ listItemLimit }
                    onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                    onPageChange={ handlePaginationChange }
                    onSortStrategyChange={ handleSortStrategyChange }
                    onSortOrderChange={ handleSortOrderChange }
                    rightActionPanel={
                        (
                            <PrimaryButton
                                onClick={ () => {
                                    setAddEditClaim(true);
                                } }
                            >
                                <Icon name="add"/>New External Dialect
                            </PrimaryButton>
                        )
                    }
                    showPagination={ true }
                    sortOptions={ SORT_BY }
                    sortStrategy={ sortBy }
                    showTopActionPanel={ !(!searchQuery && filteredDialects?.length <= 0) }
                    totalPages={ Math.ceil(filteredDialects?.length / listItemLimit) }
                    totalListSize={ filteredDialects?.length }
                >
                    {
                        filteredDialects
                        && filteredDialects instanceof Array
                        && filteredDialects.length > 0
                            ? (
                                <ClaimsList
                                    list={ paginate(filteredDialects, listItemLimit, offset) }
                                    localClaim={ ListType.DIALECT }
                                    update={ getDialect }
                                />
                            )
                            : showPlaceholders()
                    }
                </ListLayout>
            </PageLayout>
        </>
    );
};
