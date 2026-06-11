"use client"

import { useSelectCountry } from "@/api/country";
import { useLanguage } from "@/contexts/languageContext/page";
import { Button, FormControl, MenuItem, Select, Typography } from "@mui/material";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

export const SelectLocation = () => {
  const [openLocation, setOpenLocation] = useState(false);
  const { data, isLoading } = useSelectCountry();
  const { control } = useForm()
  const { t } = useLanguage()
  const storage = localStorage;

  const handleLocationChange = (event: SelectChangeEvent<string>, field) => {
    const selectedLocationId = event.target.value

    field.onChange(selectedLocationId)

    if(selectedLocationId) {
      storage.setItem("location", selectedLocationId)
    }
  }

  const handleClose = (location: boolean) => {
    setOpenLocation(location);
  };

  const handleOpen = (location: boolean) => {
    setOpenLocation(location);
  };

  return (
    <FormControl className="w-full flex flex-col justify-center items-center gap-5">
      <Button onClick={() => handleOpen(true)}>
        <Typography color="typography01">{t("country")}</Typography>
      </Button>
      <Controller
        name="country"
        control={control}
        defaultValue={localStorage.getItem("location") || ""}
        render={({ field }) => (
          <Select
            {...field}
            open={openLocation}
            onClose={() => handleClose(false)}
            onOpen={() => handleOpen(true)}
            label="location"
            onChange={(event) => handleLocationChange(event, field)}
            className="w-40"
          >
            {data?.map((datas) => (
              <MenuItem key={datas.id} value={datas.id}>
                {datas.name}
              </MenuItem>
            ))}
          </Select>
        )}
      />
    </FormControl>
  );
};
