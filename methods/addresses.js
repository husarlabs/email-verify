
module.exports.addAddresses = function(person, addresses) {
    var first = person.firstName,
        last = person.lastName,
        domain = '@' + person.domain,
        firstletter = first.charAt(0),
        lastletter = last.charAt(0)

    addresses.push(first + domain)
    addresses.push(last + domain)

    addresses.push(first + last + domain)
    addresses.push(first + '.' + last + domain)
    addresses.push(last + first + domain)
    addresses.push(last + '.' + first + domain)

    addresses.push(firstletter + last + domain)
    addresses.push(firstletter + '.' + last + domain)
    addresses.push(firstletter + lastletter + domain)
    addresses.push(firstletter + domain)

    addresses.push(last + firstletter + domain)
    addresses.push(last + '.' + firstletter + domain)
    addresses.push(first + lastletter + domain)
    addresses.push(first + '.' + lastletter + domain)
}