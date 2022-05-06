import qrcode


def generate_qr():
    img = qrcode.make("https://willowapp-dev.herokuapp.com/user/login")
    img.save("Python/src/qrcode/willowHome.jpg")
