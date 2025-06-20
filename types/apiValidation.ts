import { z } from 'zod'

const UserApiResponseSchema = z.object({
  name: z.object({
    first: z.string().min(1, "Minimum length of first name is one!"),
    last: z.string(),
  }),
  location: z.object({
    city: z.string(),
    country: z.string(),
  }),
  picture: z.object({
    medium: z.string().url(),
  }),
  nat: z.string(),
});

export const UserApiResponseWrapperSchema = z.object({
    results: z.array(UserApiResponseSchema, 
    )
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
        lat: z.string(),
        lng: z.string()
    })
    })   
});

export const GeoApiResponseSchema = z.object({
    results: z.array(AnnotationSchema)
},);


export type Annotations = z.infer< typeof AnnotationSchema>;
export type GeoApiResponse = z.infer< typeof GeoApiResponseSchema>
