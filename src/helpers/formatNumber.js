const phoneNumberFormatter = (number) => {
    // menghilangkang karakter salain angka
    let formatted = number.replace(/\D/g, '');

    // menghilangkan angka 0 didepan nomer (preflix) kemudian diganti dengan 62
    if (formatted.startsWith('0')) {
        formatted = '62' + formatted.substr(1);
    }

    // menambahkan karakter @C.us dibelakang nomer (postflix)
    if (!formatted.endsWith('@c.us')) {
        formatted += '@c.us';
    }

    return formatted;
}

module.exports = {
    phoneNumberFormatter
}