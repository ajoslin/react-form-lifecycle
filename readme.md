# react-form-lifecycle [![Build Status](https://travis-ci.org/ajoslin/react-form-lifecycle.svg?branch=master)](https://travis-ci.org/ajoslin/react-form-lifecycle)

> Effortless forms, no payload. Render-prop wrapper for [FormLifecycle](https://npm.im/form-lifecycle).


## Install

```
$ npm install --save react-form-lifecycle
```


## Usage

Recommended way of doing forms:

```js
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

Coming soon.

## License

MIT © [Andrew Joslin](http://ajoslin.com)
