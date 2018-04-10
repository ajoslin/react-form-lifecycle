# react-form-lifecycle [![Build Status](https://travis-ci.org/ajoslin/react-form-lifecycle.svg?branch=master)](https://travis-ci.org/ajoslin/react-form-lifecycle)

> Effortless forms, no payload. Render-prop wrapper for [FormLifecycle](https://npm.im/form-lifecycle).


## Install

```
$ npm install --save react-form-lifecycle
```


## Usage

```js
var FormLifecycle = require('react-form-lifecycle')
var isEmail = require('is-email-maybe')

function getErrors (form) {
  return {
    email: !form.fields.email || !isEmail(form.fields.email)
      ? new Error('Please enter a valid email.')
      : null
  }
}

function renderForm () {
  return <FormLifecycle getErrors={getErrors} render={({ form, lifecycle, errors }) => (
    <form onSubmit={e => {
      e.preventDefault()
      if (Object.keys(errors).length) {
        return lifecycle.error()
      } else {
        lifecycle.submit()
        sendApiRequest('submit-form', form.fields)
          .then(lifecycle.success, lifecycle.error)
      }
    }}>
      {errors.email && !form.pristine && <p>{errors.email.message}</p>}
      <input value={form.fields.email} type='email' onChange={e => lifecycle.edit({ email: e.target.value })} />

      <button type='submit' disabled={form.pending}>Submit</button>
    </form>
  )} />
}
```

## API

Coming soon.

## License

MIT © [Andrew Joslin](http://ajoslin.com)
