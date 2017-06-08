function AddZero(num) {
    return (num >= 0 && num < 10) ? "0" + num : num + "";
}

function getDate() {
    var now = new Date();
    var strDateTime = [[AddZero(now.getDate()),
        AddZero(now.getMonth() + 1),
        now.getFullYear()].join("/"),
        [AddZero(now.getHours()),
        AddZero(now.getMinutes())].join(":"),
        now.getHours() >= 12 ? "PM" : "AM"].join(" ");
    return strDateTime;
};
