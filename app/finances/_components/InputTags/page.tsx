import { Autocomplete, Box, Chip, Modal, Paper, TextField } from "@mui/material";

interface ValueType {
    value: string[],
    onChange: (tags: string[]) => void
    open: boolean
    onClose: () => void
}

export const InputTags = ({value = [], onChange, open, onClose}: ValueType) => {

    return (
        <Modal
            open={open}
            onClose={onClose}
            className = "flex justify-center items-center"

        >
            <Box component={Paper} className="w-100 rounded-2xl">
                <Autocomplete
                    multiple
                    freeSolo
                    selectOnFocus
                    clearOnBlur
                    handleHomeEndKeys
                    options={[]}
                    value={value}
                    onChange={(event, newValue) => {
                        onChange(newValue as string[]);
                    }}

                    renderValue={(value: string[], getTagProps) => 
                        value.map((option: string, index: number) => {
                            const { key, ...tagProps} = getTagProps({ index })
                            return (
                                <Chip 
                                    key={key}
                                    variant="outlined"
                                    label={option}
                                    {...tagProps}
                            />
                            )
                    })
                    }
                    renderInput={(params) => (
                        <TextField 
                            {...params}
                            variant="outlined"
                            label=""
                            placeholder="Digite e aperte Enter"
                            autoFocus
                        />
                    )}
                />
            </Box>          
        </Modal>
    )
}