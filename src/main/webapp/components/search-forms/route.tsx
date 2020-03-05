import Box from '@material-ui/core/Box'
import Dialog from '@material-ui/core/Dialog'
import LinearProgress from '@material-ui/core/LinearProgress'
import * as React from 'react'
import { Fragment, useState } from 'react'
import { defaultFilter } from '../query-builder/filter/filter-utils'
import QueryBuilder from '../query-builder/query-builder'
import { QueryType } from '../query-builder/types'
import SearchFormEditor from './editor'
import { SnackbarRetry as RetryNotification } from '../network-retry'
import { ApolloError } from 'apollo-client/errors/ApolloError'
const { Notification } = require('../notification/notification')

const {
  IndexCards,
  AddCardItem,
  IndexCardItem,
  Actions,
  ShareAction,
  DeleteAction,
} = require('../index-cards')

type SearchFormProps = {
  onDelete: (form: QueryType) => void
  onSave: (form: QueryType) => void
  form?: QueryType
  isDefault?: boolean
}

const SearchForm = (props: SearchFormProps) => {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(props.form)
  const onCancel = () => setEditing(false)
  const onSave = (form: QueryType) => {
    setEditing(false)
    props.onSave(form)
  }
  return (
    <Fragment>
      {editing ? (
        <Dialog fullWidth maxWidth={false} open onClose={onCancel}>
          <Box height="calc(100vh - 128px)">
            <SearchFormEditor
              queryBuilder={QueryBuilder}
              title={'Search Form Editor'}
              query={form}
              onChange={(form: QueryType) => setForm(form)}
              onCancel={onCancel}
              onSave={onSave}
            />
          </Box>
        </Dialog>
      ) : null}
      <IndexCardItem
        {...props.form}
        starred={props.isDefault}
        onClick={() => setEditing(true)}
      >
        <Actions>
          <ShareAction {...props.form} metacardType="query-template" />
          <DeleteAction
            message="This will permanently delete the search form."
            onDelete={props.onDelete}
          />
        </Actions>
      </IndexCardItem>
    </Fragment>
  )
}

type AddProps = {
  onCreate: (form: QueryType) => void
}

const defaultForm: QueryType = {
  filterTree: {
    type: 'AND',
    filters: [{ ...defaultFilter }],
  },
}
const AddSearchForm = (props: AddProps) => {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(defaultForm)
  const onCancel = () => setEditing(false)
  const onSave = (form: QueryType) => {
    setEditing(false)
    props.onCreate(form)
    setForm(defaultForm)
  }
  return (
    <Fragment>
      {editing ? (
        <Dialog fullWidth maxWidth={false} open onClose={onCancel}>
          <Box height="calc(100vh - 128px)">
            <SearchFormEditor
              queryBuilder={QueryBuilder}
              title={'Search Form Editor'}
              query={form}
              onChange={(form: QueryType) => setForm(form)}
              onCancel={onCancel}
              onSave={onSave}
            />
          </Box>
        </Dialog>
      ) : null}
      <AddCardItem onClick={() => setEditing(true)} />
    </Fragment>
  )
}

type RouteProps = {
  onDelete: (form: QueryType) => void
  onSave: (form: QueryType) => void
  onCreate: (form: QueryType) => void
  loading?: boolean
  error?: ApolloError
  forms: QueryType[]
  userDefaultForm?: string
  refetch?: () => void
}

const Route = (props: RouteProps) => {
  const [message, setMessage] = useState<string | null>(null)

  const { loading, error, forms, onDelete, onSave, onCreate, refetch } = props
  if (loading === true) return <LinearProgress />

  if (error)
    return (
      <RetryNotification
        message={'Issue retrieving search forms, would you like to retry?'}
        onRetry={refetch}
        error={error}
      />
    )
  return (
    <IndexCards>
      {message ? (
        <Notification message={message} onClose={() => setMessage(null)} />
      ) : null}
      <AddSearchForm
        onCreate={newForm => {
          onCreate(newForm)
          setMessage('Search Form Created')
        }}
      />
      {forms
        .slice()
        .sort((a: any, b: any) => (a.modified > b.modified ? -1 : 1))
        .map(form => {
          return (
            <SearchForm
              key={form.id}
              isDefault={form.id === props.userDefaultForm}
              form={form}
              onDelete={() => {
                onDelete(form)
                setMessage('Search Form Deleted')
              }}
              onSave={newForm => {
                onSave(newForm)
                setMessage('Search Form Saved')
              }}
            />
          )
        })}
    </IndexCards>
  )
}

export default Route