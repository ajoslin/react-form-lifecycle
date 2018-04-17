var React = require('react')
var { render, cleanup, Simulate, wait } = require('react-testing-library')
var filterBoolean = require('boolean-filter-obj')
var FormLifecycle = require('./')

function runApiCall () {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error('form error')), 1)
  })
}

function getFormErrors (form) {
  return filterBoolean({
    email: !form.fields.email ? new Error('please provide email') : null
  })
}

function getFormEl ({ onChange } = {}) {
  return (
    <FormLifecycle
      onChange={onChange}
      formDefaults={{ fields: { email: 'default@email.com' } }}
      render={({ form, lifecycle }) => {
        var errors = getFormErrors(form)
        return (
          <form
            data-testid='form'
            onSubmit={e => {
              e.preventDefault()
              if (Object.keys(errors).length) {
                return lifecycle.error()
              }
              lifecycle.submit()
              runApiCall().then(lifecycle.success, lifecycle.error)
            }}
          >
            {form.pending && <div data-testid='loading'>Loading...</div>}
            {form.error && (
              <div data-testid='form-error'>{form.error.message}</div>
            )}
            {errors.email &&
              !form.pristine && (
              <p data-testid='email-error'>{errors.email.message}</p>
            )}
            <input
              type='email'
              data-testid='email-input'
              value={form.fields.email}
              onChange={e => lifecycle.edit({ email: e.target.value })}
            />
          </form>
        )
      }}
    />
  )
}

afterEach(cleanup)

test('initial state', () => {
  var { getByTestId } = render(getFormEl())
  expect(getByTestId('email-input').value).toEqual('default@email.com')
  expect(() => getByTestId('form-error')).toThrow()
  expect(() => getByTestId('email-error')).toThrow()
  expect(() => getByTestId('loading')).toThrow()
})

test('typing', () => {
  var { getByTestId } = render(getFormEl())
  var input = getByTestId('email-input')
  Simulate.change(input, { target: { value: '' } })

  expect(getByTestId('email-input').value).toEqual('')
  Simulate.submit(getByTestId('form'), 'submit')
  expect(getByTestId('email-error').innerHTML).toEqual('please provide email')

  Simulate.change(input, { target: { value: 'test@email.com' } })
  Simulate.submit(getByTestId('form'), 'submit')
  expect(() => getByTestId('email-error')).toThrow()
  expect(getByTestId('loading').innerHTML).toEqual('Loading...')

  return wait(() => getByTestId('form-error')).then(() => {
    expect(() => getByTestId('loading')).toThrow()
    expect(getByTestId('form-error').innerHTML).toEqual('form error')
  })
})

test('onChange', () => {
  var changedForm
  function onChange (form) {
    changedForm = form
  }
  var { getByTestId } = render(getFormEl({ onChange }))
  expect(changedForm).toBeUndefined()
  var input = getByTestId('email-input')

  Simulate.change(input, { target: { value: 'changed' } })
  expect(changedForm).toBeTruthy()
  expect(changedForm.fields.email).toBe('changed')
})
