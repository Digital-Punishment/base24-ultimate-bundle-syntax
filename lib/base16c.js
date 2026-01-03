/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const fs = require('fs');
const path = require('path');
const {CompositeDisposable} = require('atom');

class Base16Compilation {
  constructor() {
    this.createSelectListView = this.createSelectListView.bind(this);
  }

  static initClass() {

    this.prototype.config = require('./base16c_settings').config;
  }

  activate() {
    this.disposables = new CompositeDisposable;
    this.packageName = require('../package.json').name;
    if (/light/.test(atom.config.get('core.themes').toString())) {
      atom.config.setDefaults(`${this.packageName}`, {style: 'Light'});
    }
    this.disposables.add(atom.config.observe(`${this.packageName}.scheme`, () => this.enableConfigTheme()));
    this.disposables.add(atom.config.observe(`${this.packageName}.style`, () => this.enableConfigTheme()));
    return this.disposables.add(atom.commands.add('atom-workspace', `${this.packageName}:select-theme`, this.createSelectListView));
  }

  deactivate() {
    return this.disposables.dispose();
  }

  enableConfigTheme() {
    const scheme = atom.config.get(`${this.packageName}.scheme`);
    const style = atom.config.get(`${this.packageName}.style`);
    return this.enableTheme(scheme, style);
  }

  enableTheme(scheme, style) {
    // No need to enable the theme if it is already active.
    if (!this.isPreviewConfirmed) { if (this.isActiveTheme(scheme, style)) { return; } }
    try {
      // Write the requested theme to the `syntax-variables` file.
      fs.writeFileSync(this.getSyntaxVariablesPath(), this.getSyntaxVariablesContent(scheme, style));
      const activePackages = atom.packages.getActivePackages();
      if ((activePackages.length === 0) || this.isPreview) {
        // Reload own stylesheets to apply the requested theme.
        atom.packages.getLoadedPackage(`${this.packageName}`).reloadStylesheets();
      } else {
        // Reload the stylesheets of all packages to apply the requested theme.
        for (let activePackage of Array.from(activePackages)) { activePackage.reloadStylesheets(); }
      }
      this.activeScheme = scheme;
      return this.activeStyle = style;
    } catch (error) {
      // If unsuccessfull enable the default theme.
      return this.enableDefaultTheme();
    }
  }

  isActiveTheme(scheme, style) {
    return (scheme === this.activeScheme) && (style === this.activeStyle);
  }

  getSyntaxVariablesPath() {
    return path.join(__dirname, "..", "styles", "syntax-variables.less");
  }

  getSyntaxVariablesContent(scheme, style) {
    return `\
@base16-scheme: '${this.getNormalizedName(scheme)}';
@base16-style: '${this.getNormalizedName(style)}';

@import 'schemes/@{base16-scheme}';
@import 'syntax-variables-@{base16-style}';
\
`;
  }

  getNormalizedName(name) {
    return `${name}`
      .replace(' ', '-')
      .toLowerCase();
  }

  enableDefaultTheme() {
    const scheme = atom.config.getDefault(`${this.packageName}.scheme`);
    const style = atom.config.getDefault(`${this.packageName}.style`);
    return this.setThemeConfig(scheme, style);
  }

  setThemeConfig(scheme, style) {
    atom.config.set(`${this.packageName}.scheme`, scheme);
    return atom.config.set(`${this.packageName}.style`, style);
  }

  createSelectListView() {
    const Base16cSelectListView = require('./base16c_select_list_view');
    const base16cSelectListView = new Base16cSelectListView(this);
    return base16cSelectListView.attach();
  }

  isConfigTheme(scheme, style) {
    const configScheme = atom.config.get(`${this.packageName}.scheme`);
    const configStyle = atom.config.get(`${this.packageName}.style`);
    return (scheme === configScheme) && (style === configStyle);
  }
}
Base16Compilation.initClass();

module.exports = new Base16Compilation;
