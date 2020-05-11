import os
import requests
import time
import threading
from threading import Thread
from helpers import take_new_screenshot, get_old_screenshot, update_old_screenshot, notify, get_difference, update_last_run, cleanup

# Difference tolerence
threshold = 0
now = int(time.time())


production = 'KUBERNETES_SERVICE_HOST' in os.environ

if production:
    configure_host = os.environ['CONFIGURE_SERVICE_HOST']
    configure_port = os.environ['CONFIGURE_SERVICE_PORT']
    configuration_address = f'http://{configure_host}:{configure_port}'
else:
    configure_address = 'http://0.0.0.0:8004'

def run_watcher(watcher_id, data):
    user_id = data['user_id']
    last_run = data['last_run']
    frequency = data['frequency']
    url = data['url']

    seconds_since_last_run = now - last_run
    if seconds_since_last_run > frequency:
        start = time.perf_counter()

        print(f'{watcher_id}: Updating')

        # Concurrently grab new and old screenshots
        server_file_paths = {
            'old' : None,
            'new' : None
        }
        # Take new screenshot
        t1 = Thread(target = take_new_screenshot, args = (watcher_id, url, server_file_paths, ))
        # Get old screenshot
        t2 = Thread(target = get_old_screenshot, args = (watcher_id, server_file_paths, ))
        t1.start()
        t2.start()
        t1.join()
        t2.join()

        # Get difference and notify if appropriate
        difference = get_difference(server_file_paths)

        if difference > threshold:
            print(f'{watcher_id}: Difference detected')

            # Notify
            t = Thread(target=notify, args=(user_id, url, ))
            t.start()
            
            # Update COS image
            t = Thread(target=update_old_screenshot, args=(server_file_paths['new'],))
            t.start()


        # Update last_run time  
        t = Thread(target=update_last_run, args=(watcher_id, now,))
        t.start()
        # Cleanup
        t = Thread(target=cleanup, args=(server_file_paths,))
        t.start()

        print(f'{watcher_id}: Finished in {time.perf_counter() - start} seconds')
        
    else:
        print(f'{watcher_id}: {seconds_since_last_run} < {frequency}')



if __name__ == "__main__":

    print('-----------------------------------------------------------')
    print(f'Epoch Time: {now}, Main thread: {threading.get_ident()}')
    print('-----------------------------------------------------------')

    watchers = requests.get(f'{configure_address}/watchers').json()

    threads = []
    for watcher_id, data in watchers.items():
        t = Thread(target=run_watcher, args=(watcher_id, data, ))
        threads.append((watcher_id, t))
        t.start()


    for (_,thread) in threads:
        thread.join()

    print("Main thread finished")