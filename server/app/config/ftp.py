from ftplib import FTP
import os
import socket
from contextlib import contextmanager

@contextmanager
def create_ftp_connection():
    ftp = None
    try:
        ftp = FTP(os.environ.get("BUNNY_HOSTNAME"))
        ftp.login(user=os.environ.get("BUNNY_USERNAME"), passwd=os.environ.get("BUNNY_PASSWORD"))
        print("FTP connection and login successful.")
        yield ftp  # This is where the calling code will execute
    except socket.gaierror:
        print("Failed to connect to the FTP server. Please check the server address.")
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        if ftp is not None:
            ftp.quit()
            print("FTP connection closed.")