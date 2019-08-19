import React from 'react';
import { Provider } from "react-redux";
import { mount } from 'enzyme';
import fetchMock from 'fetch-mock';
import AppContainer from './App.container';
import rootReducer from "./reducers";
import thunk from "redux-thunk";
import { applyMiddleware, createStore, compose } from "redux";

const ARTICLES = [
  { name: 'Hiking shoes', weight: 0.7 },
  { name: 'Walking stick', weight: 0.4 },
  { name: 'Sunglasses', weight: 0.1 },
];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  rootReducer,
  composeEnhancers(
    applyMiddleware(thunk)
  ));

describe('App', () => {
  let appWrapper;

  beforeEach(() => {
    fetchMock.mock(
      'https://packing-list-weight-api.herokuapp.com/articles',
      ARTICLES
    );
    appWrapper = mount(
      <Provider store={store}>
        <AppContainer />
      </Provider>
    );
  });

  afterEach(() => {
    fetchMock.reset();
  });

  describe('before articles fetched', () => {
    it('should render loading status', () => {
      expect(
        appWrapper.update().find({ 'data-selector': 'App-isLoading' })
      ).toHaveLength(1);
    });
  });

  describe('after articles fetched', () => {
    it('should render article list', done => {
      setImmediate(() => {
        expect(
          appWrapper.update().find({ 'data-selector': 'Article' })
        ).toHaveLength(ARTICLES.length);
        done();
      });
    });

    it('should render 0 as number of selected articles', done => {
      setImmediate(() => {
        expect(
          appWrapper
            .update()
            .find({ 'data-selector': 'NumberOfSelectedArticles' })
            .html()
        ).toMatch('0');
        done();
      });
    });

    it('should render 0kg as weight of selected articles', done => {
      setImmediate(() => {
        expect(
          appWrapper
            .update()
            .find({ 'data-selector': 'Weight' })
            .html()
        ).toMatch('0kg');
        done();
      });
    });

    describe('when checking 2 items', () => {
      it('should render 2 as number of selected articles', done => {
        setImmediate(() => {
          const checkboxes = appWrapper.update().find('input[type="checkbox"]');
          checkboxes.at(0).simulate('change', { target: { checked: true } });
          checkboxes.at(1).simulate('change', { target: { checked: true } });

          expect(
            appWrapper
              .find({ 'data-selector': 'NumberOfSelectedArticles' })
              .html()
          ).toMatch('2');
          done();
        });
      });

      it('should render sum of weights as weight of selected articles', done => {
        setImmediate(() => {
          const checkboxes = appWrapper.update().find('input[type="checkbox"]');
          checkboxes.at(0).simulate('change', { target: { checked: true } });
          checkboxes.at(1).simulate('change', { target: { checked: true } });

          expect(appWrapper.find({ 'data-selector': 'Weight' }).html()).toMatch(
            `${ARTICLES[0].weight + ARTICLES[1].weight}kg`
          );
          done();
        });
      });
    });
  });
});
