import { call, put, takeLatests, select } from "redux-saga/effects";
import fetch from "isomorphic-fetch";

import {
  handleIncreaseItemQuantity
} from "./itemQuantitySaga";

import {
  INCREASE_ITEM_QUANTITY,
  DECREASE_ITEM_QUANTITY,
  setItemQuantityFetchStatus,
  decreaseItemQuantity,
  increaseItemQuantity,
  FETCHING,
  FETCHED
} from "./../actions";

import { fromJS } from "immutable";

import { currentUserSelector } from "../selectors";

describe("item quantity saga", () => {
  let item;
  let user;
  beforeEach(() => {
    item = { id: 123 };
    user = fromJS({ id: "ABCDE" });
  });

  describe("handle increase item quantity", () => {
    let gen;
    beforeEach(() => {
      gen = handleIncreaseItemQuantity(item);
      expect(gen.next().value).toEqual(put(setItemQuantityFetchStatus(FETCHING)));
      expect(gen.next().value).toEqual(select(currentUserSelector));
      expect(gen.next(user).value).toEqual(call(fetch, `http://localhost:8081/cart/add/ABCDE/123`));
    });

      test("increasing quantity sucessfully",() => {
        expect(gen.next({status: 200}).value).toEqual(put(setItemQuantityFetchStatus(FETCHED)));
      });

      test("increasing quantity unsuccessful", () => {
        expect(gen.next({status: 500}).value).toEqual(put(decreaseItemQuantity(item.id, true)));
        expect(gen.next().value).toEqual(put(setItemQuantityFetchStatus(FETCHED)));
      });
  });
});