# HttpContext

Controllers receive a single `HttpContext` object:

```ts
show(ctx: HttpContext) {
  return { id: ctx.request.param('id'), name: 'John Doe' }
}
```
