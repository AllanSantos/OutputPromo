import fs from 'fs';
import path from 'path';
import csv from 'csvtojson'
import { logger, init } from '../../utils/utils';
import XlsxPopulate from 'xlsx-populate';

class OutputPromoController {
  async store(req, res) {
    req.setTimeout(500000);
    try {

      fs.readFileSync(path.resolve(__dirname, "..","..","files","upload.csv"), 'utf-8')

      let csvJSON = await csv().fromFile(path.resolve(__dirname, "..","..","files","upload.csv"));

      csvJSON = JSON.stringify(csvJSON)

      let re1 = RegExp('"\\[', 'g');
      let re2 = RegExp('\\]"', 'g');
      let re3 = RegExp('=', 'g');
      let re4 = RegExp('duplicator:', 'g');
      let re5 = RegExp(', quantity:', 'g');
      let re6 = RegExp(', idproduct:', 'g');
      let re7 = RegExp(', name:', 'g');
      let re8 = RegExp(', voucherchance:', 'g');
      let re9 = RegExp('Z\\}', 'g');

      csvJSON = csvJSON.replace(re1,'[');
      csvJSON = csvJSON.replace(re2,']');
      csvJSON = csvJSON.replace(re3,':');
      csvJSON = csvJSON.replace(re4,'"duplicator":"');
      csvJSON = csvJSON.replace(re5,'", "quantity":"');
      csvJSON = csvJSON.replace(re6,'", "idproduct":"');
      csvJSON = csvJSON.replace(re7,'", "name":"');
      csvJSON = csvJSON.replace(re8,'", "voucherchance":"');
      csvJSON = csvJSON.replace(re9,'Z"}');

      csvJSON = '{"content":' + csvJSON + '}'
      csvJSON = JSON.parse(csvJSON)

      console.log("Dados encontrados ==>", csvJSON.content.length)
  
      const resNumbers = csvJSON.content.map(item => {
        let itemParsed = JSON.parse(JSON.stringify(item.items))
  
        let obj = {
          ...item
        }
        const findDuplicators = itemParsed.filter(dup => parseInt(dup.duplicator) === 1)
        const findNotDuplicators = itemParsed.filter(dup => parseInt(dup.duplicator) === 0)
        const dplicator = []
        const notDplicator = []
  
        findDuplicators.map(v => {
          const filt = findDuplicators.find(vs => {
            return vs.idproduct === v.idproduct && !dplicator.filter((dlp) => vs.idproduct === dlp.idproduct && parseInt(dlp.duplicator) === 1).length
          })
  
          if (filt) {
            dplicator.push(filt)
          }
        })
        
        findNotDuplicators.map(v => {
          const filt = findNotDuplicators.find(vs => {
            return vs.idproduct === v.idproduct && !notDplicator.filter((dlp) => vs.idproduct === dlp.idproduct && parseInt(dlp.duplicator) === 0).length
          })
  
          if (filt) {
            notDplicator.push(filt)
          }
        })
        
        let numDp = 0;
        dplicator.map((item, index)=>{
          numDp += parseInt(item.quantity)
        })
        let numNDp = 0;
        notDplicator.map((item, index)=>{
          numNDp += parseInt(item.quantity)
        })
        obj.items = {
          qtdDuplicators: dplicator.length ? numDp : 0,
          qtdNotDuplicators: notDplicator.length ? numNDp : 0,
        }
  
        return obj
      })
      
      const res = await XlsxPopulate.fromFileAsync(path.resolve(__dirname, "..","..","files","Model_Aditoria.xlsx")).then(workbook => {
        let wsSheet = workbook.sheet("DADOS");
        let val = 1
        resNumbers.map((item, index) => {
          val++
          wsSheet.cell(`A${val}`).value(item.ParticipantId);
          wsSheet.cell(`B${val}`).value(item.Id);
          wsSheet.cell(`C${val}`).value(item.CreatedAt);
          wsSheet.cell(`E${val}`).value(item.items.qtdDuplicators);
          wsSheet.cell(`D${val}`).value(item.items.qtdNotDuplicators);
          wsSheet.cell(`F${val}`).value("");
          wsSheet.cell(`G${val}`).value("");
          
        });
        return workbook.toFileAsync(path.resolve(__dirname, "..","..","files","Output_Coupon_Date_fixed.xlsx"))
  
      }).catch(e => {
        throw e;
      })
  
      logger.info(`Encontrado registros. [${JSON.stringify(resNumbers.length)}]`);
    } catch (e) {
      console.log(e)
    }
    
    var file = `${path.resolve(__dirname, "..","..","files","Output_Coupon_Date_fixed.xlsx")}`;
    return res.download(file);
  }
}

export default new OutputPromoController();