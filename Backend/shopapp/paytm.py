from paytmchecksum import PaytmChecksum

def generate_checksum(params, merchant_key):
    return PaytmChecksum.generateSignature(params, merchant_key)

def verify_checksum(params, merchant_key, checksum):
    return PaytmChecksum.verifySignature(params, merchant_key, checksum)
