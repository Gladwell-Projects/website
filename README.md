# Gladwell Projects Website

### To Do

- [x] implement cloudflare images fully with src set and everything...
- [x] update JSX converter for lexical field
- [x] images gallery block
- [x] captions
- [x] double check figma comparison
- [x] prevent opening modals if the url is already the current route
- [ ] reconsider the data utility to be more efficient
- [ ] make static generation better -- themes
- [ ] viewing rooms
- [ ] client information

### Known Problems

- [ ] Do not activate autosave, it will break.
- [ ] some database issues with drafts where ghost documents with `id:null` are created.
  - so there's something going on with the database adapter when there are changes made where it clears the `parent_id` column because it can't make an index? maybe?
- [ ] not fully typescript compliant
- [x] live preview doesn't work on pages collection
  - just use no breadcrumbs.... for some reason nested docs are not working on this site. will circle back to this...
