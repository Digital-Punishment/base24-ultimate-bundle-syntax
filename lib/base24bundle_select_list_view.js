/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const {SelectListView} = require('atom-space-pen-views');

class Base24BundleSelectListView extends SelectListView {

  initialize(base24) {
    this.base24 = base24;
    super.initialize(...arguments);
    this.list.addClass('mark-active');
    return this.setItems(this.getThemes());
  }

  viewForItem(theme) {
    const element = document.createElement('li');
    if (this.base24.isConfigTheme(theme.scheme, theme.contrastGutter, theme.invertColors)) {
      element.classList.add('active');
    }
    element.textContent = theme.name;
    return element;
  }

  getFilterKey() {
    return 'name';
  }

  selectItemView(view) {
    super.selectItemView(...arguments);
    const theme = this.getSelectedItem();
    this.base24.isPreview = true;
    if (this.attached) { return this.base24.enableTheme(theme.scheme, theme.contrastGutter, theme.invertColors); }
  }

  confirmed(theme) {
    this.confirming = true;
    this.base24.isPreview = false;
    this.base24.isPreviewConfirmed = true;
    this.base24.setThemeConfig(theme.scheme, theme.contrastGutter, theme.invertColors);
    this.cancel();
    return this.confirming = false;
  }

  cancel() {
    super.cancel(...arguments);
    if (!this.confirming) { this.base24.enableConfigTheme(); }
    this.base24.isPreview = false;
    return this.base24.isPreviewConfirmed = false;
  }

  cancelled() {
    return (this.panel != null ? this.panel.destroy() : undefined);
  }

  attach() {
    if (this.panel == null) { this.panel = atom.workspace.addModalPanel({item: this}); }
    this.selectItemView(this.list.find('li:last'));
    this.selectItemView(this.list.find('.active'));
    this.focusFilterEditor();
    return this.attached = true;
  }

  getThemes() {
    const schemes = atom.config.getSchema(`${this.base24.packageName}.scheme`).enum;
    const contrastGutter = atom.config.get(`${this.base24.packageName}.contrastGutter`);
    const invertColors = atom.config.get(`${this.base24.packageName}.invertColors`);
    const themes = [];
    schemes.forEach(scheme => themes.push({scheme, contrastGutter, invertColors, name: `${scheme}`}));
    return themes;
  }
}

module.exports = Base24BundleSelectListView;
