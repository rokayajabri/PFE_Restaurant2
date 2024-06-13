<!DOCTYPE html>
<html>
<head>
    <title>Facturation</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f2f2f2;
            padding: 20px;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        h1 {
            font-size: 24px;
            color: #333;
            margin-bottom: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
            font-weight: bold;
        }
        tbody tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        p {
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Facture de restaurant</h1>
        <table>
            <thead>
                <tr>
                    <th>ID Commande</th>
                    <th>Montant total</th>
                    <th>Date Paiement</th>
                    <th>Statut</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                   
                    <td>{{ $facture->id_Commande }}</td>
                    <td>{{ $facture->montant_total }}</td>
                    <td>{{ $facture->datePaiement }}</td>
                    <td>{{ $facture->statut }}</td>
                </tr>
                <!-- Ajoutez plus de lignes si nécessaire pour chaque facture -->
            </tbody>
        </table>
    </div>
</body>
</html>
