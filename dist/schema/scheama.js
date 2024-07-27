"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closePermissionShcema = exports.tankDataSchema = exports.fuelBalanceSchema = exports.fuelInSchema = exports.detailSaleUpdateSchema = exports.detailSaleSchema = exports.dailyReportSchema = exports.stationDetailSchema = exports.loginUserSchema = exports.createUserSchema = exports.permitSchema = exports.rolePermitSchema = exports.userPermitSchema = exports.userRoleSchema = exports.roleSchema = exports.allSchemaId = void 0;
const zod_1 = require("zod");
exports.allSchemaId = (0, zod_1.object)({
    query: (0, zod_1.object)({
        _id: (0, zod_1.string)({
            required_error: "no data with that id",
        }).regex(/^[0-9a-fA-F]{24}$/, "invlid id"),
    }),
});
exports.roleSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        name: (0, zod_1.string)({
            required_error: "name is required",
        }),
    }),
});
exports.userRoleSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        userId: (0, zod_1.string)().regex(/^[0-9a-fA-F]{24}$/, "invlid id"),
        roleId: (0, zod_1.string)().regex(/^[0-9a-fA-F]{24}$/, "invlid id"),
    }),
});
exports.userPermitSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        userId: (0, zod_1.string)().regex(/^[0-9a-fA-F]{24}$/, "invlid id"),
        permitId: (0, zod_1.string)().regex(/^[0-9a-fA-F]{24}$/, "invlid id"),
    }),
});
exports.rolePermitSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        roleId: (0, zod_1.string)().regex(/^[0-9a-fA-F]{24}$/, "invlid id"),
        permitId: (0, zod_1.string)().regex(/^[0-9a-fA-F]{24}$/, "invlid id"),
    }),
});
exports.permitSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        name: (0, zod_1.string)({
            required_error: "name is required",
        }),
    }),
});
exports.createUserSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        name: (0, zod_1.string)({
            required_error: "Name is required",
        }),
        password: (0, zod_1.string)({
            required_error: "Password is required",
        }).min(6, "Passwrod too short should be 6 characters minimum"),
        comparePassword: (0, zod_1.string)({
            required_error: "Password confirmation is required",
        }),
        email: (0, zod_1.string)({
            required_error: "Email is required",
        }),
    }).refine((data) => data.password === data.comparePassword, {
        message: "Password do not match",
        path: ["Password Confirmation"],
    }),
});
exports.loginUserSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        email: (0, zod_1.string)({
            required_error: "Email is required",
        }),
        password: (0, zod_1.string)({
            required_error: "Password is required",
        }).min(4, "password is too short"),
    }),
});
exports.stationDetailSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        name: (0, zod_1.string)({
            required_error: "name is required",
        }),
        location: (0, zod_1.string)({
            required_error: "location is required",
        }),
        lienseNo: (0, zod_1.string)({
            required_error: "lienseNo is required",
        }),
        deviceCount: (0, zod_1.number)({
            required_error: "you need device count",
        }),
        nozzleCount: (0, zod_1.number)({
            required_error: "you need nozzle count",
        }),
    }),
});
exports.dailyReportSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        stationId: (0, zod_1.string)({
            required_error: "you need stationId",
        }).regex(/^[0-9a-fA-F]{24}$/, "invlid id"),
    }),
});
exports.detailSaleSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        stationDetailId: (0, zod_1.string)({
            // required_error: "you need stationId",
            required_error: " Nugh",
        }).regex(/^[0-9a-fA-F]{24}$/, "invlid id"),
        vocono: (0, zod_1.string)({
            // required_error: "vocono is required",
            required_error: " dd ",
        }),
        nozzleNo: (0, zod_1.string)({
            // required_error: "nozzleNo is required",
            required_error: "Not enough nozzle No",
        }),
        fuelType: (0, zod_1.string)({
            // required_error: "fuelType is required",
            required_error: "Not enough fuel type",
        }),
        salePrice: (0, zod_1.number)({
            // required_error: "You need sale price",
            required_error: "Not enough sale price",
        }),
        saleLiter: (0, zod_1.number)({
            // required_error: "You need sale Liter",
            required_error: "Not enough sale liter",
        }),
        totalPrice: (0, zod_1.number)({
            // required_error: "You need total price",
            required_error: "Not enough total price",
        }),
        totalizer_liter: (0, zod_1.number)({
            // required_error: "You need totalizer liter",
            required_error: "Not enough liter",
        }),
        totalizer_amount: (0, zod_1.number)({
            // required_error: "You need totalizer amount",
            required_error: "Not enough amount",
        }),
    }),
});
exports.detailSaleUpdateSchema = (0, zod_1.object)({
    query: (0, zod_1.object)({
        stationDetailId: (0, zod_1.string)({
            required_error: " Not enough",
        }).regex(/^[0-9a-fA-F]{24}$/, "invlid id"),
        vocono: (0, zod_1.string)({
            required_error: " Not enough",
        }),
    }),
    body: (0, zod_1.object)({
        vehicleType: (0, zod_1.string)({
            required_error: "Not enough",
        }),
    }),
});
exports.fuelInSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        // stationId: string({
        //   required_error: "you need stationId",
        // }).regex(/^[0-9a-fA-F]{24}$/, "invlid id"),
        driver: (0, zod_1.string)({
            required_error: "you need add driver",
        }),
        bowser: (0, zod_1.string)({
            required_error: "you need add bowser",
        }),
        tankNo: (0, zod_1.string)({
            required_error: "you need add tankNo",
        }),
        fuel_type: (0, zod_1.string)({
            required_error: "you need add fuel_type",
        }),
        receive_balance: (0, zod_1.string)({
            required_error: "you need add receive_balance",
        }),
    }),
});
exports.fuelBalanceSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        stationId: (0, zod_1.string)({
            required_error: "no data with that id",
        }).regex(/^[0-9a-fA-F]{24}$/, "invlid id"),
        fuelType: (0, zod_1.string)({
            required_error: "you need add fuel_type",
        }),
        capacity: (0, zod_1.string)({
            required_error: "you need add capacity",
        }),
        opening: (0, zod_1.string)({
            required_error: "you need add opening",
        }),
        tankNo: (0, zod_1.string)({
            required_error: "you need add tankNo",
        }),
        nozzles: (0, zod_1.array)((0, zod_1.string)({
            required_error: "you need add nozzles",
        })),
    }),
});
exports.tankDataSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        stationDetailId: (0, zod_1.string)({
            required_error: "No data with that id!"
        }).regex(/^[0-9a-fA-F]{24}$/, "invlid id!"),
        vocono: (0, zod_1.string)({
            required_error: "Vocono is required!"
        }),
        nozzleNo: (0, zod_1.string)({
            required_error: "Nozzle no is required!"
        }),
        data: (0, zod_1.array)((0, zod_1.object)({}))
    })
});
exports.closePermissionShcema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        stationDetailId: (0, zod_1.string)({
            required_error: "Station detail is required"
        }),
        mode: (0, zod_1.string)({
            required_error: "Mode is required"
        })
    })
});
