Mecanismul se numeste Blind Signatures [1] si rezolva anonimizarea voturilor. Apoi voturile anonimizate trebuie sa ajunga pe un canal anonim la numaratoare (de exemplu sa nu poti loga adresele IP). Pentru asta literatura recomanda Mix Networks [2].

Pe scurt, eu vad procesul in felul urmator:

A. Administratorul genereaza cheile de acces si publica pe blockchain hash-urile cheilor. Schema asta o putem intari in cateva moduri:
  a. generam doua chei pentru fiecare user, una o trimitem pe email si cealalta prin SMS. Publicam Hash(Email + SMS) si asta devine echivalent cu two-factor authentication (are nevoie de amandoua device-urile ca sa poata vota).
  b. folosim un random salt pentru fiecare runda de vot (ca sa fie rezistent la rainbow tables [3]). Administratorul publica salt-ul la inceputul rundei impreuna cu hash-urile.
  c. imediat dupa ce am trimis cheile individuale si am publicat hash-urile, stergem toate cheile si logurile (nu mai avem nevoie de alta informatie pentru autentificare in afara de hash-urile de pe blockchain).

Alternativ pentru pasul (A) cred ca merge si o schema de autentificare pe baza OpenID si un whitelist de adrese de email care au voie sa voteze (vezi Helios [4]).

B. Administratorul genereaza perechea de chei pentru criptarea (homomorfica) a voturilor si pune pe blockchain cheia publica. Alternativ, mai multi Trustees pot genera bucati din cheia privata care se consolideaza apoi intr-o singura cheie publica finala. In cazul asta, pentru decriptarea rezultatului e nevoie de toti (sau k din N) Trustees. [5]

C. Votantul construieste pachetul de vot, il cripteaza cu cheia publicata la pasul (B), ataseaza un proof de integritate, blindeaza totul cu un numar random R si trimite rezultatul (plicul) impreuna cu cheile individuale de acces (primite la pasul A) pentru semnare pe blockchain.

D. Administratorul verifica cheile individuale de acces, marcheaza hash-ul ca fiind “folosit” si semneaza plicul de la pasul C construind sirul S. Administratorul nu isi face publica cheia de semnare, dar oricine poate verifica faptul ca semnatura e corecta (folosind cheia publica) si ca semnatura a fost facuta pe motive intemeiate (demonstrarea cheilor de acces ale votantului prin verificarea hash-ului).

E. Votantul de-blindeaza sirul S primit la pasul anterior si publica (printr-un mixnet) rezultatul pe blockchain. Votul e acceptat pe baza semnaturii Administratorului (pe care oricine o poate verifica) si pe baza proof-ului de integritate (zero-knowledge proof, oricine o poate verifica).

F. La sfarsitul rundei de vot, blockchain-ul calculeaza suma (criptata) a voturilor si Administratorul (sau grupul de Trustees) decripteaza si fac reveal la rezultat.


Chair si asa, sistemul nu e ideal: trebuie sa gandim o schema pentru receipt-freeness ca in [6] si sa definim o schema de verificare a integritatii voturilor bazata pe non-interactive zero-knowledge proofs ca in [4]. In plus, rezultatul numaratorii nu e publicly verifiable by default (doar daca Administratorul sau Trustees publica la sfarsit cheia secreta). Deci eu zic sa continuam brainstorming-ul pe partea teoretica a sistemului pana cand ajungem la ceva functional, secure si trustless end-to-end.

That being said, eu stiu criptografie la nivel de hobby si n-am nici pe departe knowhow sa pun la punct toate lucrurile de mai sus. Propun sa mai implicam in discutie pe cineva care face asta full-time si intelege mult mai bine partea de crypto, l-am cunoscut recent pe Alex Lupascu si cred ca e persoana potrivita pentru asa ceva.

Lucian

[1] https://en.wikipedia.org/wiki/Blind_signature

[2] https://en.wikipedia.org/wiki/Mix_network

[3] https://en.wikipedia.org/wiki/Rainbow_table

[4] https://heliosvoting.org

[5] https://security.stackexchange.com/a/35827

[6] http://www.computing.surrey.ac.uk/personal/st/S.Schneider/papers/wote06.pdf
