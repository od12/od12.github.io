import * as Zoopla from 'zoopla';
import apikeys from './apikeys';
import { map } from './map';
import { Overlay } from 'ol';

export const zoopla = new Zoopla({ apiKey: apikeys.ZOOPLA });

export function addProperties(postcode, radius) {
  zoopla.getPropertyListings({ 
    postcode, 
    radius,
    page_size: 100,
    summarised: true,
  }).then((response) => {
    console.log(response);
  }).catch((error) => { console.log(error); });
}

