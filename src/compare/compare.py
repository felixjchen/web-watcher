from skimage.metrics import structural_similarity
import cv2


def get_difference(file_path_old, file_path_new):

    before = cv2.imread(file_path_old)
    after = cv2.imread(file_path_new)

    before, after = pad_images(before, after)

    # Convert images to grayscale
    before_gray = cv2.cvtColor(before, cv2.COLOR_BGR2GRAY)
    after_gray = cv2.cvtColor(after, cv2.COLOR_BGR2GRAY)

    # Compute SSIM between two images
    (score, diff) = structural_similarity(before_gray, after_gray, full=True)
    return 1-score


def create_difference_image(file_path_old, file_path_new, file_path_target):

    before = cv2.imread(file_path_old)
    after = cv2.imread(file_path_new)

    before, after = pad_images(before, after)


    # Convert images to grayscale
    before_gray = cv2.cvtColor(before, cv2.COLOR_BGR2GRAY)
    after_gray = cv2.cvtColor(after, cv2.COLOR_BGR2GRAY)

    # Compute SSIM between two images
    (score, diff) = structural_similarity(before_gray, after_gray, full=True)

    # The diff image contains the actual image differences between the two images
    # and is represented as a floating point data type in the range [0,1]
    # so we must convert the array to 8-bit unsigned integers in the range
    # [0,255] before we can use it with OpenCV
    diff = (diff * 255).astype("uint8")

    # Threshold the difference image, followed by finding contours to
    # obtain the regions of the two input images that differ
    thresh = cv2.threshold(
        diff, 0, 255, cv2.THRESH_BINARY_INV | cv2.THRESH_OTSU)[1]
    contours = cv2.findContours(
        thresh.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    contours = contours[0] if len(contours) == 2 else contours[1]

    # mask = np.zeros(before.shape, dtype='uint8')
    filled_after = after.copy()

    for c in contours:
        area = cv2.contourArea(c)
        if area > 40:
            x, y, w, h = cv2.boundingRect(c)
            cv2.rectangle(before, (x, y), (x + w, y + h), (36, 255, 12), 2)
            cv2.rectangle(after, (x, y), (x + w, y + h), (36, 255, 12), 2)
            # cv2.drawContours(mask, [c], 0, (0, 255, 0), -1)
            cv2.drawContours(filled_after, [c], 0, (0, 255, 0), -1)

    # cv2.imshow('before', before)
    # cv2.imshow('after', after)
    # cv2.imshow('diff', diff)
    # cv2.imshow('mask', mask)
    # cv2.imshow('filled after', filled_after)
    # cv2.waitKey(0)
    cv2.imwrite(file_path_target, after)


def pad_images(image1, image2):
    image1H, image1W, _ = image1.shape
    image2H, image2W, _ = image2.shape

    maxH = max(image1H, image2H)
    maxW = max(image1W, image2W)

    pad1H = maxH - image1H
    pad1W = maxW - image1W

    pad2H = maxH - image2H
    pad2W = maxW - image2W

    image1 = cv2.copyMakeBorder(
        image1, 0, pad1H, 0, pad1W, cv2.BORDER_CONSTANT)

    image2 = cv2.copyMakeBorder(
        image2, 0, pad2H, 0, pad2W, cv2.BORDER_CONSTANT)

    return image1, image2


if __name__ == "__main__":
    # print(get_difference('files/old_1.png', 'files/new_1.png'))
    print(create_difference_image('files/old.png',
                                  'files/new.png', 'files/difference.png'))
    pass
