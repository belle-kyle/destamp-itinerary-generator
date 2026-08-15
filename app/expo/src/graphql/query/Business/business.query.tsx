import { gql } from '@apollo/client';

export const GetUserPoisQuery = gql(
  `query GetUserPois($userId: String!) {
    userPois(userId: $userId) {
      id
      name
      address
      isVerified
      images {
        id
        image {
          id
          url
        }
      }
    }
  }
  `,
);

export const GetBusinessDetailsQuery = gql(
  `query GetBusinessDetails($poiId: String!) {
    poi(poiId: $poiId) {
      id
      name
      address
      contactNumber
      description
      price
      visitDuration
      latitude
      longitude
      accommodation {
        id
        amenities {
          id
          name
        }
      }
      restaurant {
        id
        atmospheres
      }
      categories {
        id
        name
      }
      operatingHours {
        id
        day
        closeTime
        openTime
        isClosed
        is24Hours
      }
    }
  }  
  `,
);

export const GetPoiImagesQuery = gql(
  `query GetPoiImages($poiId: String!) {
    poi(poiId: $poiId) {
      images {
        id
        image {
          id
          url
        }
      }
      id
    }
  }
  `,
);

export const GetCategoryListQuery = gql(
  `query GetAllCategories {
    categories {
      id
      name
    }
  }
`,
);
