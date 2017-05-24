import React from 'react';
import { expect, assert } from 'chai';
import { shallow } from 'enzyme';
import LoginContainer from 'assets/js/components/login/login-container.jsx';
import Login from 'assets/js/components/login/login.jsx';
import fetchMock from 'fetch-mock';
import 'isomorphic-fetch';
import sinon from 'sinon';

describe("<LoginContainer />", function() {
  let history;

  beforeEach(function(){
    history = { push: sinon.spy() };
  });

  describe("by default", function () {

    let wrapper;

    beforeEach(function () {
      wrapper = shallow(<LoginContainer history={history} />);
    });

    it("renders a login component", function () {
      expect(wrapper.find(Login)).to.have.length(1);
    });

  });

  describe("upon submit", function(){
    let wrapper, onUserChange;

    beforeEach(function () {
      fetchMock.mock("*", {body: {user: "foo"}, status: 200});
      onUserChange = sinon.spy();
      wrapper = shallow(<LoginContainer history={history} onUserChange={onUserChange} />);
      wrapper.instance().onSubmit();
    });

    afterEach(function(){
      fetchMock.restore();
    });

    it("sets a info sending flash state", function(){
      expect(wrapper.state('flashMessage')).to.contain("Sending");
      expect(wrapper.state('flashType')).to.equal('info');
    });

    it("sets a success flash state", function(done){
      setTimeout(function(){
        expect(wrapper.state('flashMessage')).to.contain("successful");
        expect(wrapper.state('flashType')).to.equal('success');
        done();
      }, 0);
    });

    it("passes json response to onUserChange handler", function(done){
      setTimeout(function(){
        expect(onUserChange.calledOnce).to.be.true;
        expect(onUserChange.calledWith("foo"));
        done();
      }, 0);

    });

    it("navigates to start", function(done){
      setTimeout(function(){
        expect(history.push.calledWith("/started")).to.be.true;
        done();
      }, 0);
    });

  });

  describe("upon submit with 500 error", function(){
    let wrapper, onUserChange;

    beforeEach(function () {
      fetchMock.mock("*", {body: {}, status: 500});
      wrapper = shallow(<LoginContainer history={history} onUserChange={onUserChange} />);
      wrapper.instance().onSubmit();
    });

    afterEach(function(){
      fetchMock.restore();
    });

    it("sets a danger technical error flash state", function(done){
      setTimeout(function(){
        expect(wrapper.state('flashMessage')).to.contain("technical problem");
        expect(wrapper.state('flashType')).to.equal('danger');
        done();
      }, 0);
    });

  });

  describe("upon submit with 401 unauthorized", function(done){
    let wrapper, onUserChange;

    beforeEach(function () {
      fetchMock.mock("*", {body: {}, status: 401});
      wrapper = shallow(<LoginContainer history={history} onUserChange={onUserChange} />);
      wrapper.instance().onSubmit();
    });

    afterEach(function(){
      fetchMock.restore();
    });

    it("sets a danger validation error flash state", function(done){
      setTimeout(function(){
        expect(wrapper.state('flashMessage')).to.contain("Could not find a user with those credentials");
        expect(wrapper.state('flashType')).to.equal('danger');
        done();
      }, 0);
    });

  });

  describe("upon submit with 400 error", function(done){
    let wrapper, onUserChange;

    beforeEach(function () {
      fetchMock.mock("*", {body: {}, status: 400});
      wrapper = shallow(<LoginContainer history={history} onUserChange={onUserChange} />);
      wrapper.instance().onSubmit();
    });

    afterEach(function(){
      fetchMock.restore();
    });

    it("sets a danger validation error flash state", function(done){
      setTimeout(function(){
        expect(wrapper.state('flashMessage')).to.contain("incorrect details");
        expect(wrapper.state('flashType')).to.equal('danger');
        done();
      }, 0);
    });

  });

});
