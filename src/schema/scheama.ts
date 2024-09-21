import { array, number, object, string } from "zod";

export const allSchemaId = object({
  query: object({
    _id: string({
      required_error: "no data with that id",
    }).regex(/^[0-9a-fA-F]{24}$/, "invlid id"),
  }),
});

export const roleSchema = object({
  body: object({
    name: string({
      required_error: "name is required",
    }),
  }),
});

export const userRoleSchema = object({
  body: object({
    userId: string().regex(/^[0-9a-fA-F]{24}$/, "invlid id"),
    roleId: string().regex(/^[0-9a-fA-F]{24}$/, "invlid id"),
  }),
});

export const userPermitSchema = object({
  body: object({
    userId: string().regex(/^[0-9a-fA-F]{24}$/, "invlid id"),
    permitId: string().regex(/^[0-9a-fA-F]{24}$/, "invlid id"),
  }),
});

export const rolePermitSchema = object({
  body: object({
    roleId: string().regex(/^[0-9a-fA-F]{24}$/, "invlid id"),
    permitId: string().regex(/^[0-9a-fA-F]{24}$/, "invlid id"),
  }),
});

export const permitSchema = object({
  body: object({
    name: string({
      required_error: "name is required",
    }),
  }),
});

export const createUserSchema = object({
  body: object({
    name: string({
      required_error: "Name is required",
    }),
    password: string({
      required_error: "Password is required",
    }).min(6, "Passwrod too short should be 6 characters minimum"),
    comparePassword: string({
      required_error: "Password confirmation is required",
    }),
    email: string({
      required_error: "Email is required",
    }),
  }).refine((data) => data.password === data.comparePassword, {
    message: "Password do not match",
    path: ["Password Confirmation"],
  }),
});

export const loginUserSchema = object({
  body: object({
    email: string({
      required_error: "Email is required",
    }),
    password: string({
      required_error: "Password is required",
    }).min(4, "password is too short"),
  }),
});

export const stationDetailSchema = object({
  body: object({
    name: string({
      required_error: "name is required",
    }),
    location: string({
      required_error: "location is required",
    }),
    lienseNo: string({
      required_error: "lienseNo is required",
    }),
    deviceCount: number({
      required_error: "you need device count",
    }),
    nozzleCount: number({
      required_error: "you need nozzle count",
    }),
  }),
});

export const dailyReportSchema = object({
  body: object({
    stationId: string({
      required_error: "you need stationId",
    }).regex(/^[0-9a-fA-F]{24}$/, "invlid id"),
  }),
});

export const detailSaleSchema = object({
  body: object({
    stationDetailId: string({
      // required_error: "you need stationId",
      required_error: " Nugh",
    }).regex(/^[0-9a-fA-F]{24}$/, "invlid id"),
    vocono: string({
      // required_error: "vocono is required",
      required_error: " dd ",
    }),
    nozzleNo: string({
      // required_error: "nozzleNo is required",
      required_error: "Not enough nozzle No",
    }),
    fuelType: string({
      // required_error: "fuelType is required",
      required_error: "Not enough fuel type",
    }),
    salePrice: number({
      // required_error: "You need sale price",
      required_error: "Not enough sale price",
    }),
    saleLiter: number({
      // required_error: "You need sale Liter",
      required_error: "Not enough sale liter",
    }),
    totalPrice: number({
      // required_error: "You need total price",
      required_error: "Not enough total price",
    }),
    totalizer_liter: number({
      // required_error: "You need totalizer liter",
      required_error: "Not enough liter",
    }),
    totalizer_amount: number({
      // required_error: "You need totalizer amount",
      required_error: "Not enough amount",
    }),
  }),
});

export const detailSaleUpdateSchema = object({
  query: object({
    stationDetailId: string({
      required_error: " Not enough",
    }).regex(/^[0-9a-fA-F]{24}$/, "invlid id"),
    vocono: string({
      required_error: " Not enough",
    }),
  }),
  body: object({
    vehicleType: string({
      required_error: "Not enough",
    }),
  }),
});

export const fuelInSchema = object({
  body: object({
    // stationId: string({
    //   required_error: "you need stationId",
    // }).regex(/^[0-9a-fA-F]{24}$/, "invlid id"),

    driver: string({
      required_error: "you need add driver",
    }),

    bowser: string({
      required_error: "you need add bowser",
    }),

    tankNo: string({
      required_error: "you need add tankNo",
    }),

    fuel_type: string({
      required_error: "you need add fuel_type",
    }),

    receive_balance: string({
      required_error: "you need add receive_balance",
    }),
  }),
});

export const fuelBalanceSchema = object({
  body: object({
    stationId: string({
      required_error: "no data with that id",
    }).regex(/^[0-9a-fA-F]{24}$/, "invlid id"),

    fuelType: string({
      required_error: "you need add fuel_type",
    }),

    capacity: string({
      required_error: "you need add capacity",
    }),

    opening: string({
      required_error: "you need add opening",
    }),

    tankNo: string({
      required_error: "you need add tankNo",
    }),

    nozzles: array(
      string({
        required_error: "you need add nozzles",
      })
    ),
  }),
});


export const tankDataSchema = object({
  body: object({
    stationDetailId: string({
      required_error: "No data with that id!"
    }).regex(/^[0-9a-fA-F]{24}$/, "invlid id!"),
    // vocono: string({
    //   required_error:"Vocono is required!"
    // }),
    nozzleNo: string({
      required_error:"Nozzle no is required!"
    }),
    data:array(object({}))
  })
});


export const closePermissionShcema = object({
  body: object({
    stationDetailId: string({
      required_error: "Station detail is required"
    }),
    mode: string({
      required_error: "Mode is required"
    })
  })
});