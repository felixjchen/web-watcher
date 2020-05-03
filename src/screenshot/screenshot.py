
import os
from selenium import webdriver
from selenium.webdriver.chrome.options import Options


def get_screenshot(url, file_path):
    """ Save an screenshot at file_path at url

    Args:
        file_path: the file_path for file
        url: url for screenshot

    Returns:
        File for success

    """
    options = Options()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument("window-size=1920,1080")

    # Production has chromedriver in PATH already.
    if os.environ.get('PRODUCTION'):
        driver = webdriver.Chrome(options=options)
    # DEV enviroment is mac chromedriver
    else:
        driver = webdriver.Chrome('./chromedriver', options=options)

    driver.get(url)
    driver.save_screenshot(file_path)
    driver.quit()

    return True
