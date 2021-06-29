// reference: https://nominatim.org/release-docs/latest/api/Output/#addressdetails

export const formatAddress = (address: any) => {
  const {
    country,
    country_code,
    region,
    state,
    state_district,
    county,
    municipality,
    city,
    town,
    village,
    city_district,
    district,
    borough,
    suburb,
    subdivision,
    hamlet,
    croft,
    isolated_dwelling,
    neighbourhood,
    allotments,
    quarter,
    road,
    house_number,
    house_name,
    postcode,
    emergency,
    historic,
    military,
    natural,
    landuse,
    place,
    railway,
    man_made,
    aerialway,
    boundary,
    amenity,
    aeroway,
    club,
    craft,
    leisure,
    office,
    mountain_pass,
    shop,
    tourism,
    bridge,
    tunnel,
    waterway,
  } = address;

  console.log(address);

  const addressObj = {
    placeName:
      emergency ||
      historic ||
      military ||
      natural ||
      landuse ||
      place ||
      railway ||
      man_made ||
      aerialway ||
      boundary ||
      amenity ||
      aeroway ||
      club ||
      craft ||
      leisure ||
      office ||
      mountain_pass ||
      shop ||
      tourism ||
      bridge ||
      tunnel ||
      waterway,
    street: `${road} ${house_number || house_name}`,
    neighbourhood:
      neighbourhood ||
      allotments ||
      quarter ||
      hamlet ||
      croft ||
      isolated_dwelling ||
      city_district ||
      district ||
      borough ||
      suburb ||
      subdivision,
    postcode,
    city: municipality || city || town || village,
    state: region || state || state_district || county,
    country: country || country_code,
  };

  console.log(addressObj);

  const addressLine = Object.values(addressObj)
    .filter((v) => v)
    .join(', ');

  return addressLine;
};
