import React from 'react';
import { expect } from 'chai';
import { mount, render } from 'enzyme';
import Share from 'assets/js/components/share.jsx';
import sinon from 'sinon';
import {
  MemoryRouter as Router,
} from 'react-router-dom';

describe("<Share />", function() {

  let wrapper;
  const user = {
    publicUrls: [ {url: 'http://localhost/#/friend/jf0s34ljla'} ]
  };

  beforeEach(function () {
    document.execCommand = sinon.stub().returns(true);
    wrapper = mount(<Router><Share user={user} /></Router>);
  });

  afterEach(function(){
    delete document.execCommand;
  });

  describe("by default", function () {

    it("contains a share url", function () {
      expect(wrapper.find('.input-group').html()).to.contain(user.publicUrls[0].url);
    });

  });

  describe("upon icon click", function(){

    it("flashes a success about copying to clipboard", function(){
      wrapper.find('.hover').simulate('click', {});
      expect(wrapper.find('.input-group').html()).to.contain("Copied!");
    });

    it("copies to clipboard", function(){
      wrapper.find('.hover').simulate('click', {});
      expect(document.execCommand.calledOnce).to.be.true;
    });

  });

});