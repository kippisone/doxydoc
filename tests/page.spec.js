'use strict';

let fl = require ('node-fl');

let Page = require ('../modules/page');
let inspect = require('inspect.js');
let sinon = require('sinon');
inspect.useSinon(sinon);

describe('Page', function() {
  describe('Class', function() {
    it('Should be a Page class', function() {
      inspect(Page).isClass();
    });
  });

  describe('render', function() {
    it('Should render a page', function() {
      let page = new Page();
      page.setTemplate('page.fire');

      let renderFTLStub = sinon.stub(page, 'parseFireTPL');
      let readStub = sinon.stub(fl, 'read');
      readStub.returns('TMPL');

      page.render();

      inspect(readStub).wasCalledOnce();
      inspect(readStub).wasCalledWith('page.fire');
      inspect(renderFTLStub).wasCalledOnce();
      inspect(renderFTLStub).wasCalledWith('TMPL');

      renderFTLStub.restore();
      readStub.restore();
    });

    it('Should render a markdown page', function() {
      let page = new Page();
      page.setTemplate('page.md');

      let renderFTLStub = sinon.stub(page, 'parseMarkdown');
      let readStub = sinon.stub(fl, 'read');
      readStub.returns('TMPL');

      page.render();

      inspect(readStub).wasCalledOnce();
      inspect(readStub).wasCalledWith('page.md');
      inspect(renderFTLStub).wasCalledOnce();
      inspect(renderFTLStub).wasCalledWith('TMPL');

      renderFTLStub.restore();
      readStub.restore();
    });

    it('Should render a html page', function() {
      let page = new Page();
      page.setTemplate('page.html');

      let parseHTMLStub = sinon.stub(page, 'parseHTML');
      let readStub = sinon.stub(fl, 'read');
      readStub.returns('TMPL');

      page.render();

      inspect(readStub).wasCalledOnce();
      inspect(readStub).wasCalledWith('page.html');
      inspect(parseHTMLStub).wasCalledOnce();
      inspect(parseHTMLStub).wasCalledWith('TMPL');

      parseHTMLStub.restore();
      readStub.restore();
    });
  });
});
