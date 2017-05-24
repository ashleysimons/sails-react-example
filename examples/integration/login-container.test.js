import React from 'react';
import { expect, assert } from 'chai';
import { mount } from 'enzyme';
import LoginContainer from 'assets/js/components/login/login-container.jsx';
import Login from 'assets/js/components/login/login.jsx';
import fetchMock from 'fetch-mock';
import 'isomorphic-fetch';
import sinon from 'sinon';

describe("<LoginContainer /> integration", function() {
  let history;

  beforeEach(function(){
    history = { push: sinon.spy() };
  });

  describe("by default", function () {

    let wrapper;

    beforeEach(function () {
      wrapper = mount(<LoginContainer history={history} />);
    });

    it("renders a login component", function () {
      expect(wrapper.find(Login)).to.have.length(1);
    });

  });

  describe("upon empty submit", function(){
    let wrapper, onUserChange;

    beforeEach(function () {
      fetchMock.mock("*", {body: {user: "foo"}, status: 200});
      onUserChange = sinon.spy();
      wrapper = mount(<LoginContainer history={history} onUserChange={onUserChange} />);

      sinon.spy(FormData.prototype, 'append');

      wrapper.find('form').simulate('submit', { preventDefault: sinon.spy() });
    });

    afterEach(function(){
      fetchMock.restore();
      FormData.prototype.append.restore();
    });

    it("shows required validation errors", function(){
      expect(wrapper.find('#email').parent().hasClass('has-error')).to.be.true;
      expect(wrapper.find('#password').parent().hasClass('has-error')).to.be.true;
    });

    it("shows a danger flash message", function(){
      expect(wrapper.find('#status').text()).to.contain('There are missing');
      expect(wrapper.find('#status').hasClass('alert-danger')).to.be.true;
    });

  });

  describe("upon submit", function(){
    let wrapper, onUserChange;

    beforeEach(function () {
      fetchMock.mock("*", {body: {user: "foo"}, status: 200});
      onUserChange = sinon.spy();
      wrapper = mount(<LoginContainer history={history} onUserChange={onUserChange} />);

      wrapper.find('#email').simulate('change', {target: {value: global.fixtures['user'][0].email}});
      wrapper.find('#password').simulate('change', {target: {value: global.fixtures['user'][0].password}});

      sinon.spy(FormData.prototype, 'append');

      wrapper.find('form').simulate('submit', { preventDefault: sinon.spy() });
    });

    afterEach(function(){
      fetchMock.restore();
      FormData.prototype.append.restore();
    });

    it("submits the form with the expected fields", function(done){
      setTimeout(function(){
        expect(FormData.prototype.append.calledWith('email', global.fixtures['user'][0].email)).to.be.true;
        expect(FormData.prototype.append.calledWith('password', global.fixtures['user'][0].password)).to.be.true;
        done();
      }, 0);
    });

  });

});
