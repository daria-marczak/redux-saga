import { take, fork, put } from "redux-saga/effects";
import fetch from "isomorphic-fetch";

import {
  SET_CART_ITEMS,
  setItemDetails
} from "./../actions";

export function* loadItemDetails(item) {
  const { id } = item;
  const response = yield fetch(`http://localhost:8081/items/${id}`);
  const data = yield response.json();
  const [info] = data;
  yield put(setItemDetails(info));
}

export function* itemDetailsSaga() {
  const { items } = yield take(SET_CART_ITEMS);
  yield items.map(item => fork(loadItemDetails, item)); // It's forking an action for each item
}