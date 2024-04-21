import React, { useEffect } from 'react';
import DisplayPdf from '../../components/DisplayPdf';
import styles from '../../styles/doc1style.module.css';
import { useRouter } from 'next/router';

function ViewDoc1() {

  const router = useRouter();

  const goBack = () => {
    router.push('/user/user_dashboard')
  }

  return(
    <div>
    <button className={styles.button} onClick={goBack}>Back</button>
    <DisplayPdf number="1"/><br/>
    </div>
  );
}

export default ViewDoc1;
