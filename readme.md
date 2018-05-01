# react-form-lifecycle [![Build Status](https://travis-ci.org/ajoslin/react-form-lifecycle.svg?branch=master)](https://travis-ci.org/ajoslin/react-form-lifecycle)

> Effortless forms, no payload. Render-prop wrapper for [FormLifecycle](https://npm.im/form-lifecycle).


## Install

```
$ npm install --save react-form-lifecycle
```


## Usage

Recommended way of doing forms:

```jsx
var FormLifecycle = require('react-form-lifecycle')
var filterBoolean = require('boolean-filter-obj')
var isEmail = require('is-email-maybe')

function renderForm () {
  return <FormLifecycle render={({ form, lifecycle }) => {
    var validationErrors = getValidationErrors(form)
    return <form onSubmit={e => {
      e.preventDefault()
      if (Object.keys(errors).length) {
        return lifecycle.error()
      } else {
        lifecycle.submit()
        sendApiRequest('submit-form', form.fields)
          .then(lifecycle.success, lifecycle.error)
      }
    }}>
      {form.error && <p>Looks like there was a submission error: {form.error}</p>}
      {validationErrors.email && !form.pristine &&
        <p>{validationErrors.email.message}</p>}
      <input value={form.fields.email} type='email' onChange={e => lifecycle.edit({ email: e.target.value })} />

      <button type='submit' disabled={form.pending}>Submit</button>
    </form>
  }} />
}

function getValidationErrors (form) {
  return filterBoolean({
    email: !form.fields.email || !isEmail(form.fields.email)
      ? new Error('Please enter a valid email.')
      : null
  })
}
```

## API

## `<FormLifecycle>`

#### Props

#### onChange

> `function (form, prevForm)` | optional

Called whenever the form is changed via [`lifecycle` methods](https://github.com/ajoslin/form-lifecycle#lifecyclecreatedata---form). Receives the newForm and prevForm as parametersj.

#### formDefaults

> `object` | optional

These values will be passed to the new [FormLifecycle object)(https://github.com/ajoslin/form-lifecycle) that is created when the component is instantiated.

Example: `<FormLifecycle formDefaults={{ fields: {rememberMe: true} }} />`

#### render

> `function()` | *required*

`<FormLifecycle render={({ form, lifecycle }) => <div />} />`

The `render` prop function is called with an object containing the following:

- `form`: An instance of [FormLifecycle](https://github.com/ajoslin/form-lifecycle#api).
- `lifecycle`: An object containing all [FormLifecycle methods](https://github.com/ajoslin/form-lifecycle#api). When called, the form will be edited and re-rendered.
  - Example: `lifecycle.edit({ email: 'test@email.com' })`.

## License

MIT © [Andrew Joslin](http://ajoslin.com)
