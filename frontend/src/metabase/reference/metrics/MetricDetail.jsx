/* eslint "react/prop-types": "warn" */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import { push } from "react-router-redux";
import { t } from "ttag";
import _ from "underscore";

import List from "metabase/components/List";
import LoadingAndErrorWrapper from "metabase/components/LoadingAndErrorWrapper";

import EditHeader from "metabase/reference/components/EditHeader";
import EditableReferenceHeader from "metabase/reference/components/EditableReferenceHeader";
import Detail from "metabase/reference/components/Detail";
import FieldsToGroupBy from "metabase/reference/components/FieldsToGroupBy";
import Formula from "metabase/reference/components/Formula";

import { getQuestionUrl } from "../utils";

import {
  getMetric,
  getTable,
  getFields,
  getError,
  getLoading,
  getUser,
  getIsFormulaExpanded,
  getForeignKeys,
} from "../selectors";

import * as metadataActions from "metabase/redux/metadata";
import * as actions from "metabase/reference/reference";

const mapStateToProps = (state, props) => {
  const entity = getMetric(state, props) || {};
  const fields = getFields(state, props);

  return {
    entity,
    table: getTable(state, props),
    metadataFields: fields,
    loading: getLoading(state, props),
    // naming this 'error' will conflict with redux form
    loadingError: getError(state, props),
    user: getUser(state, props),
    foreignKeys: getForeignKeys(state, props),
    isFormulaExpanded: getIsFormulaExpanded(state, props),
  };
};

const mapDispatchToProps = {
  ...metadataActions,

  // Metric page doesn't use Redux isEditing state and related callbacks
  // The state and callbacks are received via props
  ..._.omit(actions, "startEditing", "endEditing"),

  onChangeLocation: push,
};

const validate = (values, props) =>
  !values.revision_message
    ? { revision_message: t`Please enter a revision message` }
    : {};

@connect(mapStateToProps, mapDispatchToProps)
@reduxForm({
  form: "details",
  fields: [
    "name",
    "display_name",
    "description",
    "revision_message",
    "points_of_interest",
    "caveats",
    "how_is_this_calculated",
  ],
  validate,
})
export default class MetricDetail extends Component {
  static propTypes = {
    style: PropTypes.object.isRequired,
    entity: PropTypes.object.isRequired,
    table: PropTypes.object,
    metadataFields: PropTypes.object,
    user: PropTypes.object.isRequired,
    isEditing: PropTypes.bool,
    startEditing: PropTypes.func.isRequired,
    endEditing: PropTypes.func.isRequired,
    startLoading: PropTypes.func.isRequired,
    endLoading: PropTypes.func.isRequired,
    expandFormula: PropTypes.func.isRequired,
    collapseFormula: PropTypes.func.isRequired,
    setError: PropTypes.func.isRequired,
    updateField: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired,
    isFormulaExpanded: PropTypes.bool,
    loading: PropTypes.bool,
    loadingError: PropTypes.object,
    submitting: PropTypes.bool,
    onChangeLocation: PropTypes.func.isRequired,
  };

  render() {
    const {
      fields: {
        name,
        display_name,
        description,
        revision_message,
        points_of_interest,
        caveats,
        how_is_this_calculated,
      },
      style,
      entity,
      table,
      metadataFields,
      loadingError,
      loading,
      user,
      isEditing,
      startEditing,
      endEditing,
      expandFormula,
      collapseFormula,
      isFormulaExpanded,
      handleSubmit,
      resetForm,
      submitting,
      onChangeLocation,
    } = this.props;

    const onSubmit = handleSubmit(
      async fields =>
        await actions.rUpdateMetricDetail(
          this.props.entity,
          fields,
          this.props,
        ),
    );

    return (
      <form style={style} className="full" onSubmit={onSubmit}>
        {isEditing && (
          <EditHeader
            hasRevisionHistory={true}
            onSubmit={onSubmit}
            endEditing={endEditing}
            reinitializeForm={resetForm}
            submitting={submitting}
            revisionMessageFormField={revision_message}
          />
        )}
        <EditableReferenceHeader
          entity={entity}
          table={table}
          type="metric"
          headerIcon="ruler"
          headerLink={getQuestionUrl({
            dbId: table && table.db_id,
            tableId: entity.table_id,
            metricId: entity.id,
          })}
          name={t`Details`}
          user={user}
          isEditing={isEditing}
          hasSingleSchema={false}
          hasDisplayName={false}
          startEditing={startEditing}
          displayNameFormField={display_name}
          nameFormField={name}
        />
        <LoadingAndErrorWrapper
          loading={!loadingError && loading}
          error={loadingError}
        >
          {() => (
            <div className="wrapper">
              <div className="pl4 pr3 pt4 mb4 mb1 bg-white rounded bordered">
                <List>
                  <li className="relative">
                    <Detail
                      id="description"
                      name={t`Description`}
                      description={entity.description}
                      placeholder={t`No description yet`}
                      isEditing={isEditing}
                      field={description}
                    />
                  </li>
                  <li className="relative">
                    <Detail
                      id="points_of_interest"
                      name={t`Why this metric is interesting`}
                      description={entity.points_of_interest}
                      placeholder={t`Nothing interesting yet`}
                      isEditing={isEditing}
                      field={points_of_interest}
                    />
                  </li>
                  <li className="relative">
                    <Detail
                      id="caveats"
                      name={t`Things to be aware of about this metric`}
                      description={entity.caveats}
                      placeholder={t`Nothing to be aware of yet`}
                      isEditing={isEditing}
                      field={caveats}
                    />
                  </li>
                  <li className="relative">
                    <Detail
                      id="how_is_this_calculated"
                      name={t`How this metric is calculated`}
                      description={entity.how_is_this_calculated}
                      placeholder={t`Nothing on how it's calculated yet`}
                      isEditing={isEditing}
                      field={how_is_this_calculated}
                    />
                  </li>
                  {table && !isEditing && (
                    <li className="relative">
                      <Formula
                        type="metric"
                        entity={entity}
                        isExpanded={isFormulaExpanded}
                        expandFormula={expandFormula}
                        collapseFormula={collapseFormula}
                      />
                    </li>
                  )}
                  {!isEditing && (
                    <li className="relative mt4">
                      <FieldsToGroupBy
                        fields={table.fields
                          .map(fieldId => metadataFields[fieldId])
                          .reduce(
                            (map, field) => ({ ...map, [field.id]: field }),
                            {},
                          )}
                        databaseId={table && table.db_id}
                        metric={entity}
                        title={t`Fields you can group this metric by`}
                        onChangeLocation={onChangeLocation}
                      />
                    </li>
                  )}
                </List>
              </div>
            </div>
          )}
        </LoadingAndErrorWrapper>
      </form>
    );
  }
}
