//Just a dummy model
exports.runPrediction = (data) => {

    const result = data.map(row => {
        return {
            wavelength: row.wavelength,
            dissolution: row.intensity * 0.85
        }
    })

    return result
}