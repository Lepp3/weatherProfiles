import { z } from 'zod'
import { lengthMessageError, validationError} from '../constants';

const UserApiResponseSchema = z.object({
  name: z.object({
    first: z.string().min(1, lengthMessageError('First Name')),
    last: z.string().min(1, lengthMessageError('Last Name')),
  }),
  location: z.object({
    city: z.string().min(1, lengthMessageError('City')),
    country: z.string().min(1, lengthMessageError('Country')),
  }),
  picture: z.object({
    medium: z.string().url("Invalid image url provided from API"),
  }),
  nat: z.string().min(1, lengthMessageError('Nationality')),
},{message:validationError});

export const UserApiResponseWrapperSchema = z.object({
    results: z.array(UserApiResponseSchema, {message:validationError})
});

export type UserApiResponse = z.infer<typeof UserApiResponseSchema>;


export const WeatherApiResponseSchema = z.object({
  current: z.object({
    time: z.string(),
    interval: z.number(),
    weather_code: z.number(),
    temperature_2m: z.number(),
    relative_humidity_2m: z.number()
  },)
});


export type WeatherApiResponse = z.infer<typeof WeatherApiResponseSchema>;


export const AnnotationSchema = z.object({
    annotations: z.object({
        DMS: z.object({
        lat: z.string().min(1, lengthMessageError('Latitude')),
        lng: z.string().min(1, lengthMessageError('Longitude'))
    })
    })   
});

export const GeoApiResponseSchema = z.object({
    results: z.array(AnnotationSchema)
},{message:validationError});


export type Annotations = z.infer< typeof AnnotationSchema>;
export type GeoApiResponse = z.infer< typeof GeoApiResponseSchema>
